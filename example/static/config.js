/* eslint-disable no-unused-vars */
// @ts-nocheck
/**
 * 默认配置
 */

export const transform = {
  // 请求之前处理配置，支持 async await 处理
  beforeRequestHook(config, options) {
    // console.log(" =====> beforeRequestHook", config, options);
    return config;
  },
  // 格式化响应数据
  formatResponseData(result, options) {
    // console.log(" =====> formatResponseData", result, options);
    console.log("打印请求值 ☞", result);
    return result;
  },
  // 错误提示回调方法
  errorTipsCallback(error, fromErrorStatus) {
    console.error(`错误信息通用处理：${error?.errmsg || error?.message || JSON.stringify(error)}`)
  },
  // 请求之前的拦截器
  requestInterceptors(config, options) {
    // console.log(" =====> requestInterceptors", config, options);
    return config;
  },
  // 请求之后的拦截器
  responseInterceptors(response) {
    return response;
  },
  // 请求之前的拦截器错误处理
  requestInterceptorsCatch(error) {
    console.log(error);
    return Promise.reject(error);
  },
  // 请求之后的拦截器错误处理
  responseInterceptorsCatch(error) {
    if (error && error.response) {
      if (error.response.status >= 500) {
        error.message = "服务器开小差了……";
      }
    }

    return Promise.reject(error);
  },
}

export const requestOptions = {
  isShowErrorTips: true, // 开启报错提示
  isCancelDuplicate: true, // 忽略重复请求
  isRequestJson: false, // 是否使用 json 传递请求参数
  isDirectResponse: false, // 是否直接返回响应体
  debounce: {
    delay: 2000, // 请求防抖
    immediate: false, // 接口返回时允许再次请求
  },
}