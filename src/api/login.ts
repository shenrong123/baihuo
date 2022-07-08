import { axiosAjax } from "./common";

export default {
  // 用户登录 密码登录
  login(params: object) {
    return axiosAjax("/users/login", "post", {
      data: params
    });
  },

  // 用户列表
  accountList(params: object) {
    return axiosAjax("/users/getUserList", "post", {
      data: params
    });
  },

  // 添加用户
  addAccount(params: object) {
    return axiosAjax("/users/regist", "post", {
      data: params
    });
  },

  // 修改用户
  editAccount(params: object) {
    return axiosAjax("/users/modify", "post", {
      data: params
    }); 
  },

  // 删除用户
  deleteUser(params: object) {
    return axiosAjax("/users/deleteUser", "post", {
      data: params
    });
  },
};
