import { ActionTree, GetterTree, MutationTree } from "vuex";
import goodsApi from "../../api/goods";
import qs from 'qs';

interface State {
  shopLists: number;
}
const state: State = {
  shopLists: 0
};

const mutations: MutationTree<any> = {
  ["shopsCount"](state, data): void {
    state.shopLists = data;
  }
};

const actions: ActionTree<any, any> = {
  /**
   * 统计购物车商品列表
   * @param param0
   * @param data
   */
  shopmallLists({ commit }, data) {
    const params = {
      customerId: JSON.parse((sessionStorage as any).getItem("userInfo") || null).userId,
      finishTime: null
    }
    return goodsApi.getOrderList((qs as any).stringify(params)).then((res:any) => {
      const result = res.result.rows[0] || {};
      const orders = JSON.parse(result.orders || null) || []
      commit("shopsCount", orders.length);
      return res;
    });
  },

  /**
   * 编辑购物车商品列表
   * @param param0
   * @param data
   */
  editOrderList({ commit }, data) {
    return goodsApi.editOrderList(data).then(res => {
      return res;
    });
  },

  /**
   * 获取订单列表
   * @param param0
   * @param data
   */
  getOrderList({ commit }, data) {
    return goodsApi.getOrderList(data).then(res => {
      return res;
    });
  },

  /**
   * 获取商品列表
   * @param commit
   * @param data 用户参数
   */
   getGoodsList({ commit }, data) {
    return goodsApi.getGoodsList(data).then(res => {
      return res;
    });
  },

  /**
   * 编辑商品列表
   * @param commit
   * @param data 用户参数
   */
  editGoods({ commit }, data) {
    return goodsApi.editGoods(data).then(res => {
      return res;
    });
  },

  /**
   * 删除商品
   * @param commit
   * @param data 用户参数
   */
  deleteGoods({ commit }, data) {
    return goodsApi.deleteGoods(data).then(res => {
      return res;
    });
  },

  /**
   * 商品去重
   * @param commit
   * @param data 用户参数
   */
  judgeOne({ commit }, data) {
    return goodsApi.judgeOne(data).then(res => {
      return res;
    });
  },

  /**
   * 添加商品
   * @param commit
   * @param data 用户参数
   */
  addGoods({ commit }, data) {
    return goodsApi.addGoods(data).then(res => {
      return res;
    });
  },

  /**
   * 新建订单
   * @param commit
   * @param data 用户参数
   */
  addOrderList({ commit }, data) {
    return goodsApi.addOrderList(data).then(res => {
      return res;
    });
  }
};

const getters: GetterTree<any, any> = {
  shopLists(state) {
    return state.shopLists;
  }
};

export default {
  state,
  mutations,
  actions,
  getters
};
