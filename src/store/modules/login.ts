import { ActionTree, GetterTree, MutationTree } from "vuex";
import accountApi from "../../api/login";

const actions: ActionTree<any, any> = {
  /**
   * 登录
   * @param commit
   * @param data 用户参数
   */
  login({ commit }, data) {
    return accountApi.login(data).then(res => {
      return res;
    });
  },

  /**
   * 用户列表
   * @param commit
   * @param data 用户参数
   */
  accountList({ commit }, data) {
    return accountApi.accountList(data).then(res => {
      return res;
    });
  },
  /**
   * 添加用户
   * @param commit
   * @param data 用户参数
   */
  addAccount({ commit }, data) {
    return accountApi.addAccount(data).then(res => {
      return res;
    });
  },
  /**
   * 修改用户
   * @param commit
   * @param data 用户参数
   */
  editAccount({ commit }, data) {
    return accountApi.editAccount(data).then(res => {
      return res;
    });
  },

  /* 删除用户 */
  deleteUser({ commit }, data) {
    return accountApi.deleteUser(data).then(res => {
      return res;
    });
  },
};

export default {
    actions
}