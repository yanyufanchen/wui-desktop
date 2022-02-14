<template>
  <div class="bottomBar">
    <div class="box flex XcenterYcenter" :style="{ background: user.systemData.color }">
      <div class="left wui-icon">
        <el-popover
          popper-class="popper-lowerMenu"
          placement="bottom-end"
          width="650"
          trigger="click"
          @show="showLowerMenu"
          :visible-arrow="false"
          v-model="lowerMenuFlag"
        >
          <div
            class="icon flex XcenterYcenter"
            slot="reference"
            style="color: #fff"
          >
            <i class="fa fa-windows fa-lg"></i>
          </div>
          <slot>
            <div class="lowerMenu" :style="{ background: user.systemData.color }">
              <div
                class="sidebar"
                @mouseleave="sidebarWidth = '48px'"
                :style="{ width: sidebarWidth }"
              >
                <div
                  class="mask"
                  style="background-color: white; opacity: 0.02"
                ></div>
                <div class="btn wui-icon" @click="cutSidebar">
                  <i class="fa fa-fw fa-align-justify"></i>
                  <span class="title">开始</span>
                </div>
                <div class="btn-group">
                  <el-popover
                    placement="top-start"
                    width="200"
                    trigger="click"
                    v-model="lowerMenuUserFlag"
                    popper-class="popper-lowerMenu-userSelect"
                    :visible-arrow="false"
                    content="这是一段内容,这是一段内容,这是一段内容,这是一段内容。"
                  >
                    <div class="btn wui-icon" title="我的账户" slot="reference">
                      <div class="icon" style="background: none">
                        <i class="fa fa-fw fa-user-circle-o"></i>
                      </div>
                      <span class="title">我的账户</span>
                    </div>
                    <slot>
                      <div
                        class="userSelect"
                        :style="{ background: user.systemData.color }" style="cursor: pointer;"
                      >
                        <div class="userSelectItem" @click="userSelect(1)">
                          修改账户
                        </div>
                        <div class="userSelectItem" @click="userSelect(2)">
                          锁定
                        </div>
                      </div>
                    </slot>
                  </el-popover>
                  <div class="btn wui-icon" title="系统设置" @click="systemSet">
                    <div class="icon" style="background: none">
                      <i class="fa fa-fw fa-gear"></i>
                    </div>
                    <span class="title">系统设置</span>
                  </div>
                  <div class="btn wui-icon" title="退出账户" @click="quit">
                    <div class="icon" style="background: none">
                      <i class="el-icon-switch-button"></i>
                    </div>
                    <span class="title">退出账户</span>
                  </div>
                </div>
              </div>
              <div class="menu"></div>
              <div class="tiles-box"></div>
            </div>
          </slot>
        </el-popover>
      </div>
      <div class="center flex XleftYcenter">
        <div
          class="appModalBar win-task flex XleftYcenter"
          :style="{ width: `${appModalBarWidth}px` }"
          v-for="(item, index) in user.wuiModals"
          :key="item.id"
          @click="selectModal(item)"
          :class="
            item.zIndex ==
              Web_api.getArrMaxValue(user.wuiModals, 'zIndex') &&
            item.show_flag
              ? 'appModalBarActive'
              : ''
          "
        >
          <div
            class="icon flex XcenterYcenter"
            style=""
            :style="{
              backgroundColor: stores.find(
                (item2) => item2.app_id == item.app_id
              ).backgroundColor,
            }"
          >
            <i
              class="fa fa-lg"
              :class="
                stores.find((item2) => item2.app_id == item.app_id).icon
              "
            ></i>
          </div>
          <div class="title">
            {{
              stores.find((item2) => item2.app_id == item.app_id).title
            }}
          </div>
          <div
            class="line"
            :style="{
              width: `${
                item.zIndex ==
                  Web_api.getArrMaxValue(user.wuiModals, 'zIndex') &&
                item.show_flag
                  ? '100%'
                  : '90%'
              }`,
            }"
          ></div>
        </div>
      </div>
      <div class="right flex XcenterYcenter">
        <div class="date wui-icon">
          <!-- <el-popover
            popper-class="popper-lowerDate"
            placement="bottom-end"
            width="294"
            trigger="click"
            :visible-arrow="false"
            v-model="lowerDateFlag"
          >
            
          </el-popover> -->
		  <div
		    class="icon flex YcenterXcenter wui-icon"
		    style="height: 40px; width: 80px;cursor: pointer;position: relative;"
		    slot="reference" @click="cutDate"
		  >
		    <div class="time">18:15</div>
		    <div class="yearDay">2021/12/16</div>
		  </div>
		  
		    <div class="dateBox" :style="{ background: user.systemData.color }" v-if="lowerDateFlag" style="position: absolute;bottom:40px;right:0">
		      <sCalendar />
		    </div>
		  
        </div>
        <div class="news wui-icon flex XcenterYcenter" @click="cutNews">
          <i class="fa fa-comment-o fa-lg"></i>
        </div>
        <div class="home wui-icon"></div>
      </div>
    </div>
    <div
      class="drawer"
      :style="{ width: drawerNewsWidth, background: user.systemData.color }"
    >
      <div
        class="mask"
        style="
          background-color: white;
          opacity: 0.02;
          width: 100%;
          height: 100%;
        "
      ></div>
    </div>
  </div>
</template>

<script>
import { mapState } from "vuex";
import sCalendar from "@/components/s-calendar/s-calendar.vue";
export default {
  name: "bottomBar", // 底部任务栏
  data() {
    return {
      lowerDateFlag: false, // 右侧时间栏
      lowerMenuFlag: false, // 左侧菜单栏
      lowerMenuUserFlag: false, // 左侧菜单用户栏
      sidebarWidth: "48px", // 左侧菜单工具栏宽度控制
      drawerNewsWidth: "0px", // 右侧菜单消息抽提栏控制
      appModalBarWidth: 180,
    };
  },
  computed: {
    ...mapState(["systems", "stores", "user"]),
  },
  components: {
    sCalendar,
  },
  onLoad() {
  },
  methods: {
    showLowerMenu() {
      this.drawerNewsWidth = "0px";
    },
    cutSidebar() {
      this.sidebarWidth = this.sidebarWidth == "48px" ? "268px" : "48px";
    },
    cutNews() {
      this.drawerNewsWidth = this.drawerNewsWidth == "0px" ? "360px" : "0px";
      if (this.drawerNewsWidth == "360px") {
        this.lowerMenuFlag = false;
      }
    },
    // 点击左下角菜单用户按钮  1 修改用户 2 锁定
    userSelect(type) {
	  this.lowerMenuUserFlag=false
      if (type === 1) {
		  this.lowerMenuFlag=false
		  this.Utils.openModal(this,{
			app_id:'wui-system'
		},{
		  	data:{
		  		type:'system-me'
		  	}
		  })
      }
      if (type === 2) {
        this.$BusEvent.$emit("initDesktop");
        this.$store.commit("locking", true);
      }
    },
	cutDate(){
		console.log('日期')
		this.lowerDateFlag=!this.lowerDateFlag
	},
	systemSet(){
		this.lowerMenuFlag=false
		// 如果没有下载该应用,就无法查看
		if(!this.user.myappList.find(item=>item.app_id=='wui-system')){
			this.$message.warning('请前往引用商店安装系统设置')
			return
		}
		this.Utils.openModal(this,
		{
			app_id:'wui-system'
		},
		{
			data:{
				type:'system-home'
			}
		})
	},
    // 退出
    quit() {
      this.$confirm('确定要退出当前账户吗?', '退出', {
      	confirmButtonText: '确定',
      	cancelButtonText: '取消',
      	type: 'warning'
      }).then(() => {
      	this.$store.commit('logout');
      	uni.redirectTo({
      		url: "/pages/home/login"
      	});
      }).catch(() => {});
    },
    // 点击底部当前窗口
    selectModal(active) {
      // 点击,将当前项排到最后一位，目的是置顶
      let user = this.Web_api.clone(this.user);
      let maxIndex = this.Web_api.getArrMaxValue(user.wuiModals, "zIndex");
      if (active.zIndex === maxIndex) {
        // 如果已经是最顶层 隐藏
        this.Utils.setModalHide(this, active);
        return;
      }
      // 置顶显示
      this.Utils.setModalTop(this, active);
    },
  },
};
</script>
<style></style>
<style lang="less" scoped>
.el-popover {
  background: none !important;
}

// 左下角菜单
.lowerMenu {
  height: 600px;

  mini_sidebar {
  }

  .sidebar {
    // width: 48px;
    height: 100%;

    position: absolute;
    left: 0;
    top: 0;
    transition: all 0.3s;
    overflow: hidden;
    z-index: 20;

    .mask {
      position: absolute;
      top: 0;
      left: 0;
      z-index: -1;
      width: 100%;
      height: 100%;
      transition: all 0.3s;
    }

    .btn {
      min-width: 28px;
      width: 256px;
      text-align: left;
      line-height: 52px;
      font-size: 18px;
      transition: all 0.5s;
      float: left;
      position: relative;
      color: white;
      padding-left: 12px;

      .icon {
        font-size: 16px;
        display: inline-block;
        position: relative;
        width: 23.14px;
        height: 23.14px;
        line-height: 23.14px;
        text-align: center;
      }
    }

    .btn-group {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
    }

    .title {
      padding-left: 20px;
      line-height: inherit;
      font-size: 14px;
    }
  }
}
.userSelect {
  padding: 10px 0;
  border: 1px solid #87878740;
  .userSelectItem {
    height: 30px;
    line-height: 30px;
    padding: 0 10px;
    color: #fff;
  }
  .userSelectItem:hover {
    background-color: #9e9e9e;
  }
}
// .right {
// 	.date:hover {
// 		.dateBox {
// 			display: block;
// 		}
// 	}
// }
// 时间栏
.dateBox {
  width: 350px;
  height: 550px;
  padding: 10px;
}

// 消息提醒
.drawer {
  position: absolute;
  right: 0;
  top: 0;
  transition: all 0.3s;
  // background-color: #ccc;
  height: calc(100vh - 40px);
}

.bottomBar {
  width: 100%;
  height: 40px;
  opacity: 0.95;
  z-index: 1000;

  .box {
    height: 100%;
  }

  .left {
    width: 50px;
    height: 40px;

    .icon {
      width: 100%;
      height: 100%;
    }
  }

  .center {
    flex: 1;
    height: 100%;

    .appModalBar {
      margin-right: 1px;
      box-sizing: border-box;
      padding: 10px;
      // border-bottom: 4px solid #ccc;
      position: relative;
		cursor: default;
      .icon {
        width: 15px;
        height: 15px;
        font-size: 10px;
        color: #fff;
        margin-right: 10px;
      }

      .title {
        color: #fff;
      }

      .line {
        position: absolute;
        bottom: 0;
        height: 3px;
        // width: 80%;
        transition: all 0.5s;
        background-color: rgba(255, 255, 255, 0.47);
        // left: 5px;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
      }
    }

    .appModalBar:hover {
      background-color: rgba(191, 191, 191, 0.25);

      .line {
        width: 100% !important;
      }
    }

    .appModalBarActive {
      background-color: rgba(191, 191, 191, 0.25);
    }

    .win-task {
      min-width: 0;
      max-width: 150px;
      text-align: left;
      overflow: hidden;
      // padding: 0;
      height: 100%;
    }
  }

  .right {
    color: #fff;

    .date {
    }

    .news {
      width: 48px;
      height: 40px;
    }

    .home {
      width: 5px;
      height: 40px;
      border-left: 1px solid #ccc;
    }
  }
}
</style>
