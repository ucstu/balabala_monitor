<template>
  <header class="main">
    <div class="left">
      <i class="fa fa-bars" @click="hiddenAside = !hiddenAside"></i>
      <span
        ><img class="logo" src="/logo.png" alt="logo" /><strong
          >BalaBala云</strong
        ></span
      >
      <select v-model="appId" name="app">
        <option value="b2FdF9cb-1EE7-Dc6e-de9C-1cAcf37dcdd5">仿掘金1</option>
        <option value="b2FdF9cb-1EE7-Dc6e-de9C-1cAcf37dcdd6">仿掘金2</option>
      </select>
    </div>
    <div class="right">
      <span><i class="fa fa-search"></i></span>
      <span><input type="text" /></span>
      <router-link to="/Overview" class="i overview" active-class="active">
        概览
      </router-link>
      <div class="i father">
        <a href="#">行为</a><i class="fa fa-chevron-down"></i>
        <ul>
          <li>
            <router-link to="/Behavior/BehaviorSearch">
              行为记录搜索
            </router-link>
          </li>
        </ul>
      </div>
      <div class="i father">
        <a href="#">错误</a><i class="fa fa-chevron-down"></i>
        <ul>
          <li>
            <router-link to="/Mistaken/BasicMistaken">
              代码错误统计
            </router-link>
          </li>
          <li>
            <router-link to="/Mistaken/InterfaceMistaken">
              接口错误统计
            </router-link>
          </li>
          <li>
            <router-link to="/Mistaken/ResourceMistaken">
              资源错误统计
            </router-link>
          </li>
        </ul>
      </div>
      <div class="i father">
        <a href="#">性能</a><i class="fa fa-chevron-down"></i>
        <ul>
          <li>
            <router-link to="/Performance/PagePerformance">
              页面性能统计
            </router-link>
          </li>
          <li>
            <router-link to="/Performance/InterfacePerformance">
              接口性能统计
            </router-link>
          </li>
        </ul>
      </div>
      <img src="@/assets/no_user.png" alt="#" />
    </div>
  </header>
</template>

<script setup lang="ts">
import { useStore } from "@/stores";
import { storeToRefs } from "pinia";

const store = useStore();
const { appId } = storeToRefs(store);

const { hiddenAside: _hiddenAside } = defineProps<{
  hiddenAside: boolean;
}>();

const emits = defineEmits<{
  (event: "update:hiddenAside", value: boolean): void;
}>();

const hiddenAside = $computed({
  get: () => _hiddenAside,
  set: (value) => emits("update:hiddenAside", value),
});
</script>

<style scoped lang="scss">
.main {
  display: flex;
  justify-content: space-between;
  width: 100%;
  height: 50px;
  background-color: white;
  box-shadow: 0 3px 10px 0 rgb(0 0 0 / 4%);

  .left {
    display: flex;
    align-items: center;
    justify-content: space-between;

    .fa-cloud-upload,
    strong {
      padding: 0 10px;
      color: #ea6947;
    }

    .logo {
      width: 40px;
      height: 40px;
      margin-left: 10px;
    }

    span {
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .fa-bars {
      padding: 12.5px 14px;
      font-size: 25px;
      color: white;
      background-color: #ea6947;
    }

    .fa-cloud-upload {
      font-size: 30px;
    }
  }

  .right {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 5px 10px;

    span {
      display: flex;
      align-items: center;
      padding: 5px;
      background-color: rgb(244 240 240 / 50%);

      input {
        background-color: rgb(244 240 240 / 50%);
        border: none;

        &:focus {
          outline: none;
        }
      }
    }

    .i {
      padding: 10px 20px;
    }

    .overview.active {
      font-weight: 700;
      color: #ea6947;
    }

    a {
      color: grey;
      text-decoration: none;

      &:hover {
        color: #ea6947;
        transition: top 0.3s ease;
      }
    }

    img {
      margin: 0 30px 0 20px;
    }

    .father {
      position: relative;

      ul {
        position: absolute;
        top: 20px;
        left: 0;
        z-index: 20;
        display: flex;
        display: none;
        align-items: center;
        padding: 5px;
        list-style: none;

        li a {
          display: inline-block;
          width: 150px;
          height: 42px;
          padding-left: 20px;
          font-size: 15px;
          line-height: 42px;
          color: rgb(100 98 98);
          text-decoration: none;
          background-color: white;
          border-radius: 5px;
        }

        li a:hover {
          background-color: rgb(230 230 230);
        }
      }

      &:hover {
        ul {
          display: block;
        }
      }

      .fa {
        font-size: 10px;
        color: grey;
      }
    }
  }
}
</style>
