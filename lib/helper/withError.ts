import axios from "axios";
import { isCancel } from "../core/axiosDebounce";
import { isFunction } from "./utils";

/**
 * 判断是否为内部自定义错误
 * @param err Error
 * @returns 
 */
export const isCustomCancel = (err: Error) => {
  return isCancel(err) || axios.isCancel(err)
}

/**
 * 封装处理内部自定义错误回调
 * @param err Error
 * @param argus any[]
 * @returns Function
 */
export const withErrorHandler = (err: Error, ...argus: any[]) => (callback: Function) => {
  if (!isFunction(callback)) {
    console.error("this callback is not a function.");
    return;
  }

  if (isCustomCancel(err)) {
    return;
  }

  callback(err, ...argus);
}
