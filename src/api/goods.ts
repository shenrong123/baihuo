import { axiosAjax } from "./common";

export default {
  // 用户登录 密码登录
  getGoodsList(params: object) {
    return axiosAjax("/good/list", "post", {
      data: params
    });
  },

  // 商品购物车列表
  shopmallLists(params: object) {
    return axiosAjax("/order/shopmallLists", "post", {
      data: params
    });
  },

  // 编辑购物车列表
  editOrderList(params: object) {
    return axiosAjax("/goods/editOrderList", "post", {
      data: params
    });
  },

  // 获取订单列表
  getOrderList(params: object) {
    return axiosAjax("/order/list", "post", {
      data: params
    });
  },

  // 编辑商品
  editGoods(params: object) {
    return axiosAjax("/good/editGoods", "post", {
      data: params
    });
  },

  // 删除商品
  deleteGoods(params: object) {
    return axiosAjax("/good/deleteGood", "post", {
      data: params
    });
  }, 

  // 商品去重
  judgeOne(params: object) {
    return axiosAjax("/goods/judgeOne", "post", {
      data: params
    });
  },  

  // 添加商品
  addGoods(params: object) {
    return axiosAjax("/good/regist", "post", {
      data: params
    });
  },

  // 新增订单
  addOrderList(params: object) {
    return axiosAjax("/order/add", "post", {
      data: params
    });
  },
};
