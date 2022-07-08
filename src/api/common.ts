import axios from "axios";
import { Vue } from "vue-property-decorator";
import ErrorHandle from "../utils/error-handle";

// axios.defaults.withCredentials = true; //跨域保存session有用
// axios.defaults.baseURL = "http://192.168.31.39:3000";
axios.defaults.baseURL = "http://121.4.97.71:8001";

export function axiosAjax(url: string, method: string, options: object) {
  const defaultOptions = {
    method,
    // withCredentials: true,
    timeout: 1000000
  };
  options = Object.assign(
    {
      url: url || "",
      method: method || "POST",
      // credentials: 'include',
      headers: {
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
        authorization: `Bearer ${localStorage.getItem("token")}`
      }
    },
    defaultOptions,
    options || {}
  );
  return new Promise((resolve, reject) => {
    axios(options)
      .then(res => {
        if (res.data.success) {
          resolve(res.data);
        } else {
          // TODO: 如果用户手动删除sessionStorage 之后的报错需特殊处理，并且页面跳转到登陆页(待有时间优化)
          ErrorHandle.showMsg(res.data.code, res.data.desc, {
            type: "error"
          });
          reject(res);
        }
      })
      .catch(error => {
        const { response } = error;
        reject(error);
        if (response.status === 401) {
          window.location.href = '/login'
        }
        const errorMessage = error.response;
        if (errorMessage.status === 401) {
          window.location.href = '/login'
          return
        }
        ErrorHandle.showMsg(errorMessage.data.code, errorMessage.data.desc, {
          type: "error"
        });
      });
  });
}
