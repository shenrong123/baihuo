<template>
  <div>
    <div class="layout-logo">
      <router-link :to="{ name: 'commodityList'}">
        <img alt="Shrine Logo" src="../assets/elogo.png">
      </router-link>
    </div>
    <Menu
      ref="side_menu"
      :active-name="activeMenuItem"
      theme="dark"
      width="auto"
      :class="menuitemClasses"
      :open-names="[openedSubMenuName]"
    >
      <MenuItem name="shopsList" :to="{ name: 'shopsList' }">商品列表</MenuItem>
      <MenuItem name="shoppingMall" :to="{ name: 'shoppingMall' }">我的购物车</MenuItem>
      <MenuItem name="orderList" :to="{ name: 'orderList' }">订单列表</MenuItem>
      <MenuItem v-if="userInfo.category === 'admin'" name="commodityList" :to="{ name: 'commodityList' }">商品管理</MenuItem>

      <Submenu name="accountCenter">
        <template slot="title">用户中心</template>
        <MenuItem
          name="accountList"
          :to="{ name: 'accountList'}"
          v-if="userInfo.category === 'admin'"
        >
          <Icon type="ios-person-outline" :size="20"/>用户管理
        </MenuItem>
        <MenuItem
          name="modifyPassword"
          :to="{ name: 'modifyPassword'}"
          v-if="userInfo.category !== 'admin'"
        >
          <Icon type="ios-lock-outline" :size="20"/>修改密码
        </MenuItem>
        <!-- 除了管理员 其他人都能看到消息中心 -->
        <!-- <MenuItem name="shopMall" v-if="userInfo.category !== 'admin'" :to="{ name: 'shopMall' }">
          <Icon type="md-cart" :size="20"/>商品清单
        </MenuItem> -->
      </Submenu>
    </Menu>
  </div>
</template>

<style scoped>
.layout-logo {
  width: 100%;
  height: 64px;
  position: relative;
  margin-bottom: 10px;
}

.layout-logo > a {
  display: block;
  width: 100%;
  height: 100%;
}

.layout-logo > a > img {
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  margin: auto;
}
.menu-icon {
  transition: all 0.3s;
}
.rotate-icon {
  transform: rotate(-90deg);
}
.menu-item span {
  display: inline-block;
  overflow: hidden;
  width: 69px;
  text-overflow: ellipsis;
  white-space: nowrap;
  vertical-align: bottom;
  transition: width 0.2s ease 0.2s;
}
.menu-item i {
  transform: translateX(0px);
  transition: font-size 0.2s ease, transform 0.2s ease;
  vertical-align: middle;
  font-size: 16px;
}
.collapsed-menu span {
  width: 0px;
  transition: width 0.2s ease;
}
.collapsed-menu i {
  transform: translateX(5px);
  transition: font-size 0.2s ease 0.2s, transform 0.2s ease 0.2s;
  vertical-align: middle;
  font-size: 22px;
}
</style>

<script lang="ts">
import { Component, Prop, Vue, Watch } from "vue-property-decorator";
import { Menu } from "iview";

@Component({
  components: {}
})
export default class AppSlider extends Vue {
  private menuitemClasses = {};

  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  // 二级菜单
  get openedSubMenuName() {
    if (
      ["accountList", "modifyPassword", "shopMall"].indexOf(
        this.activeMenuItem
      ) > -1
    ) {
      return "accountCenter";
    }
    return "";
  }

  private activeMenuItem: string = "";

  private mounted() {
    this.changeActiveMenuItem();
  }

  @Watch("$route")
  private changeActiveMenuItem() {
    let routerName: any = this.$route.name;
    // let routerName:string = ''
    const routerPath: any = this.$route.path.toLowerCase();
    if (routerPath.indexOf("/commodity") > -1) {
      // 客户管理
      routerName = "commodityList";
    } else if (routerPath.indexOf("/accountlist") > -1) {
      routerName = "accountList";
    } else if (routerPath.indexOf("/modifypassword") > -1) {
      routerName = "modifyPassword";
    } else if (routerPath.indexOf("/shopmall") > -1) {
      routerName = "shopMall";
    } else if (routerPath.indexOf("/shopslist") > -1) {
      routerName = "shopsList";
    } else if (routerPath.indexOf("/shoppingmall") > -1) {
      routerName = "shoppingMall";
    } else if (routerPath.indexOf("/orderlist") > -1) {
      routerName = "orderList";
    }

    // this.activeMenuItem = this.$route.name;
    this.activeMenuItem = routerName || this.$route.name;
    // TODO: 解决第一次从消息中心跳转到工作组成员菜单不高亮
    setTimeout(() => {
      const ref: any = this.$refs;
      const sideMenu = ref.side_menu as Menu;
      sideMenu.updateActiveName();
    }, 500);
  }

  private created() {
    this.changeActiveMenuItem();
  }
}
</script>
