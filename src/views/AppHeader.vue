<template>
  <div class="header">
    <!-- <Icon
      @click.native="collapsedSider"
      :class="rotateIcon"
      :style="{ margin: '0 20px' }"
      type="md-menu"
      size="24"
    ></Icon>-->
    <div class="avatar-box">
      <!-- <Avatar icon="ios-person" size="large"/> -->
      <!-- <Col span="2"> -->
      <Menu mode="horizontal" @on-select="logout()">
        <Submenu name="1" mode="vertical">
          <template slot="title">
            <Avatar icon="ios-person" size="large"/>
            <!-- <img v-else class="img-avatar" :src="userInfo.avatar"> -->
          </template>
          <MenuItem name="logout">登出</MenuItem>
        </Submenu>
      </Menu>
      <!-- </Col> -->
    </div>
    <div class="avatar-box" style="padding-right: 0px;cursor:pointer" @click="toShoppingMall">
      <Icon type="md-cart" size="24" :color="shopLists ? '#32cd9c' : ''"></Icon>
      <span>{{shopLists}}</span>
    </div>
  </div>
  <!-- <Icon :style="{margin: '0 20px'}" type="md-menu" size="24"></Icon> -->
</template>

<style scoped>
.layout-nav {
  width: 420px;
  margin: 0 auto;
  margin-right: 20px;
}
.header .avatar-box {
  float: right;
}
.header .ivu-menu-horizontal {
  height: 64px;
}
.header .ivu-menu-submenu >>> .ivu-menu-submenu-title span > i {
  margin-right: 0px;
}
.header .img-avatar {
  width: 40px;
  height: 40px;
  vertical-align: middle;
  border-radius: 50%;
}
</style>

<script lang="ts">
import { Component, Prop, Vue } from "vue-property-decorator";

@Component({
  components: {}
})
export default class AppHeader extends Vue {
  // 获取用户信息
  get userInfo() {
    var items: any = sessionStorage.getItem("userInfo");
    return JSON.parse(items);
  }

  get shopLists(): number {
    return this.$store.getters.shopLists;
  }

  private rotateIcon = {};
  private collapsedSider() {
    // TODO
    console.log("collapsedSider");
  }

  private toShoppingMall() {
    this.$router.push({ name: "shoppingMall" });
  }

  // 统计我的未读消息数
  private getUnreadMessages() {
    const params = {
      customerId: this.userInfo._id
    };
    // this.$store.dispatch("shopmallLists", params);
    // .then(res => {
    //   this.unreadMsgCountTimeout = setTimeout(this.getUnreadMessages, 30000)
    // })
  }

  // 获取账号列表
  private logout() {
    sessionStorage.clear();
    this.$router.push({ name: "login" });
  }

  private created() {
    this.getUnreadMessages();
  }
}
</script>
