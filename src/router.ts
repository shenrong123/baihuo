import Vue from "vue";
import Router from "vue-router";
// import Home from './views/Home.vue';

function load(component: string): any {
  return () => import(`@/views/${component}.vue`);
}

Vue.use(Router);

export default new Router({
  mode: "history",
  // base: process.env.BASE_URL,
  routes: [
    {
      path: "/",
      name: "home",
      component: load("Home"),
      children: [
        // 商品管理
        {
          path: "/shopsList",
          name: "shopsList",
          component: load("shops/ShopsList")
        },
        // 我的购物车
        {
          path: "/shoppingMall",
          name: "shoppingMall",
          component: load("shops/ShoppingMall")
        },
        // 订单列表
        {
          path: "/orderList",
          name: "orderList",
          component: load("shops/OrderList")
        },
        // 订单详情
        {
          path: "/orderList/orderInfo/:orderId",
          name: "orderInfo",
          component: load("shops/ShoppingMall")
        },
        // 商品管理
        {
          path: "/commodity/list",
          name: "commodityList",
          component: load("commodity/CommodityList")
        },
        // 新增商品管理
        {
          path: "/commodity/create",
          name: "createCommodity",
          component: load("commodity/CreateCommodity")
        },
        // 新增商品管理
        {
          path: "/commodity/edit/:commodityId",
          name: "modifyCommodity",
          component: load("commodity/CreateCommodity")
        },
        // 用户列表
        {
          path: "/account/list",
          name: "accountList",
          component: load("account/AccountList")
        },
        // 新增用户
        {
          path: "/account/create",
          name: "createAccount",
          component: load("account/CreateAccount")
        },
        // 编辑用户
        {
          path: "/account/edit/:accountId",
          name: "modifyAccount",
          component: load("account/CreateAccount")
        },
        // 修改密码
        {
          path: "/account/modifyPassword",
          name: "modifyPassword",
          component: load("account/ModifyPassword")
        }
      ]
    },
    {
      path: "/login",
      name: "login",
      component: load("Login")
    }
  ]
});
