import axios from "axios";
import QueryString from "qs";
import type { AxiosInstance, AxiosResponse, AxiosError } from "axios";
import {
  AxiosRequestConfigGlobal,
  CreateAxiosOptions,
  RequestOptions,
  ResponseData,
} from "../types/interface";
import { AxiosCanceler } from "./axiosCancel";
import { isFunction } from "../helper/utils";
import { ContentTypeEnum, RequestEnum, ResultEnum } from "../types/enum";
import { AxiosDebounce, DebounceError } from "./axiosDebounce";
import { isCustomCancel } from "lib/helper/withError";

class AxiosInstall {
  private axiosInstance: AxiosInstance;
  private options: CreateAxiosOptions;

  constructor(options: CreateAxiosOptions) {
    this.options = options;
    this.axiosInstance = axios.create(options);
    this.setupAxiosInterceptors();
  }

  /**
   * 配置处理请求拦截器
   * @returns
   */
  private setupAxiosInterceptors() {
    const { transform } = this.options;
    if (!transform) {
      return;
    }
    const {
      requestInterceptors,
      requestInterceptorsCatch,
      responseInterceptors,
      responseInterceptorsCatch,
    } = transform;

    const axiosCanceler = new AxiosCanceler();

    // 添加请求拦截器
    this.axiosInstance.interceptors.request.use(
      (config: AxiosRequestConfigGlobal<ResponseData>) => {
        const { isCancelDuplicate } = config;

        // 判断全局配置和单个请求配置项，支持
        const ignoreCancel =
          isCancelDuplicate !== undefined
            ? isCancelDuplicate
            : this.options.requestOptions?.isCancelDuplicate;

        ignoreCancel && axiosCanceler.addPending(config);

        if (isFunction(requestInterceptors)) {
          return requestInterceptors(config, this.options);
        }

        return config;
      },
      (error: AxiosError) => {
        if (isFunction(requestInterceptorsCatch)) {
          return requestInterceptorsCatch(error);
        }
        return Promise.reject(error);
      }
    );

    // 添加响应拦截器
    this.axiosInstance.interceptors.response.use(
      (
        response: AxiosResponse<
          ResponseData,
          AxiosRequestConfigGlobal<ResponseData>
        >
      ) => {
        response && axiosCanceler.removePending(response.config);
        if (isFunction(responseInterceptors)) {
          return responseInterceptors(response);
        }
        return response;
      },
      (error: AxiosError) => {
        if (isFunction(responseInterceptorsCatch)) {
          return responseInterceptorsCatch(error);
        }
        return Promise.reject(error);
      }
    );
  }

  /**
   * @description:  创建axios实例
   */
  create(options: CreateAxiosOptions): void {
    if (!this.axiosInstance) {
      return;
    }
    this.axiosInstance = axios.create(options);
  }

  async request<T = any>(
    axiosConfig: CreateAxiosOptions,
    options?: RequestOptions
  ): Promise<any> {
    const { transform, requestOptions } = this.options;
    const mergeOptions: RequestOptions = Object.assign(
      {},
      requestOptions,
      options
    );
    const { beforeRequestHook, errorTipsCallback, formatResponseData, afterRequestHook } =
      transform || {};
    if (isFunction(beforeRequestHook)) {
      axiosConfig = await beforeRequestHook(axiosConfig, mergeOptions);
    }

    axiosConfig.requestOptions = mergeOptions;
    axiosConfig.headers = {
      "Content-Type": mergeOptions.isRequestJson
        ? ContentTypeEnum.JSON
        : ContentTypeEnum.FORM_URLENCODED,
      ...(axiosConfig.headers || {}),
    };

    const debounceInstance = new AxiosDebounce(mergeOptions.debounce);

    try {
      if (debounceInstance.has(axiosConfig)) {
        throw new DebounceError()
      }
      debounceInstance.add(axiosConfig);
      const response = await this.axiosInstance.request(axiosConfig);

      // 兼容响应流媒体返回，常用于文件下载
      if (mergeOptions.isDirectResponse) {
        return Promise.resolve(response);
      }

      const data: ResponseData<T> = response.data;

      // 格式化成通用格式
      const formatData =
        (isFunction(formatResponseData) &&
          formatResponseData(data, mergeOptions)) ||
        data;

      if (+formatData.errcode === ResultEnum.SUCCESS) {
        return Promise.resolve(formatData);
      }

      if (mergeOptions.isShowErrorTips && isFunction(errorTipsCallback)) {
        // 调用错误提示
        errorTipsCallback(formatData, false);
      }
      return Promise.reject(formatData);
    } catch (err: any) {
      // 内部自定义错误直接往上抛出
      if (isCustomCancel(err)) {
        return Promise.reject(err);
      }
      if (mergeOptions.isShowErrorTips && isFunction(errorTipsCallback)) {
        // 调用错误提示
        errorTipsCallback(err, true);
      }
      return Promise.reject(err);
    } finally {
      if (mergeOptions.debounce?.immediate) {
        // 如果此时报错，则直接移除
        debounceInstance.remove(axiosConfig);
      }

      // 请求完成后执行
      if (isFunction(afterRequestHook)) {
        afterRequestHook();
      }
    }
  }

  get(url: string, params?: object, options: RequestOptions = {}) {
    return this.request(
      {
        method: RequestEnum.GET,
        url,
        params,
        ...options,
      },
      options
    );
  }

  post(url: string, data?: object, options: RequestOptions = {}) {
    return this.request(
      {
        method: RequestEnum.POST,
        url,
        data: options.isRequestJson ? data : QueryString.stringify(data),
        ...options,
      },
      options
    );
  }

  put(url: string, data?: object, options: RequestOptions = {}) {
    return this.request(
      {
        method: RequestEnum.PUT,
        url,
        data,
        ...options,
      },
      options
    );
  }

  delete(url: string, params?: object, options: RequestOptions = {}) {
    return this.request(
      {
        method: RequestEnum.DELETE,
        url,
        params,
        ...options,
      },
      options
    );
  }

  getBlob(url: string, params?: object, options: RequestOptions = {}) {
    return this.request(
      {
        method: RequestEnum.GET,
        url,
        params,
        responseType: "blob",
        ...options,
      },
      {
        isShowErrorTips: false,
        isDirectResponse: true,
        ...options,
      }
    );
  }

  postBlob(url: string, data?: object, options: RequestOptions = {}) {
    return this.request(
      {
        method: RequestEnum.POST,
        url,
        data,
        responseType: "blob",
        ...options,
      },
      {
        isShowErrorTips: false,
        isDirectResponse: true,
        ...options,
      }
    );
  }
}

export default AxiosInstall;
