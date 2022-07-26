import { Injectable } from "@nestjs/common";
import { ElasticsearchService } from "@nestjs/elasticsearch";
import { javascripterrorIndex } from "src/config/db.index";
import { JavaScriptError } from "src/entity/javaScriptError.entity";
import { responseRust } from "src/entity/responseRust";
import { totalData } from "src/utils/esUtils";
import { getTotalErrorBody } from "src/utils/searchBody";
import {
  JavaScriptErrorTotalVo,
  JavaScriptErrorVo,
} from "src/vo/javascripterror.vo";
const SqlString = require("sqlstring");
@Injectable()
export class JavascripterrorService {
  constructor(private readonly elasticsearchService: ElasticsearchService) {}
  /**
   * js 错误,上报数据
   * @param javaScriptError
   * @returns
   */
  async uploadError(javaScriptError: JavaScriptError[]) {
    const body = [];
    javaScriptError.forEach((e) => {
      body.push({ index: { _index: javascripterrorIndex } });
      body.push(e);
    });
    const res = await this.elasticsearchService.bulk({
      index: javascripterrorIndex,
      body,
    });
    if (res.statusCode === 200) {
      return responseRust.success_creat();
    }
    return responseRust.error("上传失败,原因:" + JSON.stringify(res));
  }

  /**
   * js 错误列表查询
   * @param querys
   * @returns
   */
  async getErrorList(querys: JavaScriptErrorVo) {
    //const body = getQueryBody(querys, "errorTime");
    if (querys.start_time.length === 10) {
      querys.start_time = querys.start_time + " 00:00:00";
      querys.end_time = querys.end_time + " 00:00:00";
    }
    const sqlString = `
            SELECT msg,count(msg),url ,line,column,userID,pageUrl
            FROM "javascript_error"
            where appId=? and mainType=? and subType=? and errorTime between ? and ?
            group by msg,url, line,column,userID,pageUrl
            order by count(msg) desc
        `;
    const sqlArges = [
      querys.app_id,
      querys.main_type,
      querys.sub_type,
      new Date(querys.start_time).getTime(),
      new Date(querys.end_time).getTime(),
    ];

    const sql = SqlString.format(sqlString, sqlArges);
    const rest = await this.elasticsearchService.sql.query({
      body: {
        query: sql,
      },
    });
    if (rest.statusCode !== 200) {
      return responseRust.error();
    }
    const map = new Map();
    rest.body.rows.forEach((item) => {
      const value = {
        msg: item[0],
        count: item[1],
        url: item[2],
        line: item[3],
        column: item[4],
        userCount: 1,
        pageCount: 1,
        userList: [item[5]],
        pageList: [item[6]],
        average: 0,
      };
      const key = `${item[0]}${item[2]}${item[3]}${item[4]}`;
      if (map.has(key)) {
        const mapItem = map.get(key);
        if (!mapItem.userList.includes(value.userList[0])) {
          mapItem.userCount++;
          mapItem.userList.push(value.userList[0]);
        }
        if (!mapItem.pageList.includes(value.pageList[0])) {
          mapItem.pageCount++;
          mapItem.pageList.push(value.pageList[0]);
        }
        map.get(key).count += value.count;
      } else {
        map.set(key, value);
      }
    });

    // 是否要限制返回条数
    let list = [...map.values()];
    if (querys.size) {
      list = list.slice(0, parseInt(querys.size + ""));
    }
    return responseRust.success_data(list);
  }

  /**
   * js错误,统计查询
   * @param querys
   * @returns
   */
  async totalError(querys: JavaScriptErrorTotalVo) {
    const body = getTotalErrorBody(querys);
    const res = await this.elasticsearchService.search({
      index: javascripterrorIndex,
      body,
    });
    if (res.statusCode !== 200) {
      return responseRust.error();
    }
    const list = totalData(querys, res.body.aggregations.count.buckets);
    return responseRust.success_data(list);
  }
  // /**
  //  * 处理数据
  //  * @param list
  //  * @returns
  //  */
  // private getData(list) {
  //   const restList = [];
  //   list.forEach((e) => {
  //     restList.push({
  //       dateTime: dayjs(e.key).format("YYYY-MM-DD MM:mm:ss"),
  //       count: e.doc_count,
  //       userCount: e.userCount.value,
  //     });
  //   });
  //   return restList;
  // }
}
