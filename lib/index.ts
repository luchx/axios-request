import AxiosInstall from "./core/instance";
import { deepMerge } from "./helper/utils";
import { isCustomCancel } from "./helper/withError";
import { CreateAxiosOptions } from "./types/interface";

const defaultOptions: CreateAxiosOptions = {
  responseType: "json",
  withCredentials: false,
  requestOptions: {
    isShowErrorTips: true,
    isDirectResponse: false,
    isCancelDuplicate: true,
    isRequestJson: true,
    debounce: {
      delay: 2000,
      immediate: true,
    }
  },
};

/**
 * 拦截处理 reject 事件
 */
window.addEventListener('unhandledrejection', function (event) {
  if (isCustomCancel(event.reason)) {
    event.preventDefault();
    return;
  }
});

export { saveAs } from "./helper/fileSaver";

export { withErrorHandler } from "./helper/withError";

export function createAxios(options: CreateAxiosOptions): AxiosInstall {
  return new AxiosInstall(deepMerge(defaultOptions, options));
}

export default createAxios;
