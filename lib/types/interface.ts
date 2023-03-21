import type {
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";

export interface ResponseData<T = any> {
  errcode: number;
  errmsg: string;
  data?: T;
}

export interface DebounceOption {
  delay: number; // 2000
  immediate?: boolean; // 请求回来之后立即触发
}

export interface RequestOptions {
  // 是否显示失败信息
  isShowErrorTips?: Boolean;
  // 不进行任何处理，直接返回，用于数据流下载模式
  isDirectResponse?: boolean;
  // 取消重复请求，防止多次调用
  isCancelDuplicate?: boolean;
  // 使用 json 参数格式
  isRequestJson?: boolean;
  // 控制防抖参数
  debounce?: DebounceOption;
}

export interface CreateAxiosOptions extends AxiosRequestConfig {
  transform?: AxiosTransform;
  requestOptions?: RequestOptions;
}

export interface AxiosRequestConfigGlobal<D = any>
  extends InternalAxiosRequestConfig<D>,
    RequestOptions {}

export abstract class AxiosTransform {
  /**
   * @description: 请求之前处理配置
   * @description: Process configuration before request
   */
  beforeRequestHook?: (
    config: AxiosRequestConfig,
    options: RequestOptions
  ) => AxiosRequestConfig;

  /**
   * @description: 请求之后处理配置
   * @description: Process configuration after request
   */
  afterRequestHook?: () => void;

  /**
   * @description: 格式化响应数据
   */
  formatResponseData?: (
    response: ResponseData,
    options: RequestOptions
  ) => ResponseData;

  /**
   * @description: 错误提示回调方法
   */
  errorTipsCallback?: (error: Error | ResponseData, isFromError) => void;

  /**
   * @description: 请求之前的拦截器
   */
  requestInterceptors?: (
    config: AxiosRequestConfigGlobal,
    options: CreateAxiosOptions
  ) => AxiosRequestConfigGlobal;

  /**
   * @description: 请求之后的拦截器
   */
  responseInterceptors?: (response: AxiosResponse<any>) => AxiosResponse<any>;

  /**
   * @description: 请求之前的拦截器错误处理
   */
  requestInterceptorsCatch?: (error: Error) => Promise<any>;

  /**
   * @description: 请求之后的拦截器错误处理
   */
  responseInterceptorsCatch?: (error: Error) => Promise<any>;
}
