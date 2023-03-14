import QueryString from "qs";
import type { AxiosRequestConfig } from "axios";

const toString = Object.prototype.toString;

/**
 * @description: 判断值是否未某个类型
 */
export function is(val: unknown, type: string) {
  return toString.call(val) === `[object ${type}]`;
}

/**
 * @description:  是否为函数
 */
export function isFunction<T = Function>(val: unknown): val is T {
  return is(val, "Function") || is(val, "AsyncFunction");
}

/**
 * @description: 是否为对象
 */
export const isObject = (val: any): val is Record<any, any> => {
  return val !== null && is(val, "Object");
};

/**
 *
 * @param origin
 * @param target
 * @returns
 */
export function deepMerge<T>(origin: any = {}, target: any = {}): T {
  let key: string;
  for (key in target) {
    origin[key] = isObject(origin[key])
      ? deepMerge(origin[key], target[key])
      : (origin[key] = target[key]);
  }
  return origin;
}

/**
 * 判断是否为客户端
 * @returns 
 */
export const isClient = () => typeof window !== "undefined";

/**
 * 获取配置并组合
 * @param config 
 * @returns 
 */
export const getPendingUrl = (config: AxiosRequestConfig) =>
  [
    config.method,
    config.url,
    QueryString.stringify(config.data),
    QueryString.stringify(config.params),
  ].join("&");