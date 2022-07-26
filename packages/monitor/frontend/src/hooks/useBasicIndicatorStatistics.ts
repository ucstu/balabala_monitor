import {
  BasicIndicator,
  getPerformancesBasicindicatorstatistics,
} from "@/apis";
import { useStore } from "@/stores";
import type { MaybeComputedRef } from "@vueuse/core";
import { useDebounceFn } from "@vueuse/core";
import dayjs from "dayjs";
import { computed, ref, watch } from "vue";
import { dateTimeFormate } from "./configs";
import type { BasicStatisticItem, BasicStatisticParam } from "./types";

const store = useStore();

export interface BasicIndicatorStatisticParam extends BasicStatisticParam {
  /*
   * 父级分类
   */
  mainType: BasicIndicator.mainType;
  /*
   * 子级分类
   */
  subType: BasicIndicator.subType;
}

export type BasicIndicatorStatisticItem = BasicStatisticItem;

export const useBasicIndicatorStatistics = (
  _param: MaybeComputedRef<BasicIndicatorStatisticParam>
) => {
  const param = typeof _param === "function" ? computed(_param) : ref(_param);
  const basicIndicatorStatistics =
    ref<Array<Array<BasicIndicatorStatisticItem>>>();
  const basicIndicatorStatisticsLoading = ref(false);
  const _getPerformancesBasicIndicatorStatistics = useDebounceFn(() => {
    if (param.value._skip) {
      return;
    }
    basicIndicatorStatisticsLoading.value = true;
    getPerformancesBasicindicatorstatistics({
      ...param.value,
      appId: store.appId,
      startTime: param.value.startTime.format(dateTimeFormate),
      endTime: param.value.endTime.format(dateTimeFormate),
    })
      .then((res) => {
        basicIndicatorStatistics.value = res.data.map((section) =>
          section.map((item) => {
            return {
              ...item,
              dateTime: dayjs(item.dateTime, dateTimeFormate),
            };
          })
        );
      })
      .finally(() => {
        basicIndicatorStatisticsLoading.value = false;
      });
  }, 20);
  watch(
    () => param.value,
    () => _getPerformancesBasicIndicatorStatistics(),
    {
      immediate: !param.value._lazy,
    }
  );
  return {
    basicIndicatorStatisticsLoading,
    basicIndicatorStatistics,
    reload: _getPerformancesBasicIndicatorStatistics,
  };
};
