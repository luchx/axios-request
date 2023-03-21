# 前端请求配置库

## 安装

```bash
# 安装插件
npm install axios-request
```

## 使用

> 推荐使用 ts 书写，代码提示更适合

- 创建 service.ts

```ts
// src/axios/service.ts
import { createAxios } from "axios-request";
import axiosConfig from "./config.ts";

const service = createAxios(axiosConfig);

export default service;

```

- 创建配置文件 config.ts

配置文件默认会接受所有 axios 的配置项，另外提供了 `transform` 钩子函数，和自定义全局配置项 `requestOptions`，见下文。

```ts
// src/axios/config.ts

export default {
  // axiosConfig 接受来自 axios 的所有配置项，见 <https://www.axios-http.cn/docs/req_config>
  ...axiosConfig,
  transform: transform,
  requestOptions: requestOptions,
}

```

## 实例方法

example request

```ts
import service from "@/axios/service";

export function ApiMockRequest(data) {
  return service.post("xxx ", data, {
    isCancelDuplicate: true, // 忽略重复请求
    isDirectResponse: false, // 直接返回响应体
    isRequestJson: true, // 使用 json 参数请求
    isShowErrorTips: true, // 显示错误提示
  });
}

```

更多方法

```ts
import service from "src/axios/service.ts"

// axiosConfig 为 axios 请求配置，requestOptions 为自定义配置项，见下文

// request 方法
service.request(axiosConfig, requestOptions)

// 使用 get 请求
service.get(url, params, requestOptions)

// 使用 post 请求，默认请求参数类型为 form-data
service.post(url, formData, requestOptions)

// 使用 post 请求，请求参数类型为 json
service.post(url, data, {
  isRequestJson: true
})

// 使用 delete 请求
service.delete(url, params, requestOptions)

// 使用 put 请求
service.put(url, data, requestOptions)

// 使用 getBlob 请求，获取二进制文件，其中 requestOptions.responseType 为 "blob"
service.getBlob(url, params, requestOptions)

// 使用 postBlob 请求，获取二进制文件，其中 requestOptions.responseType 为 "blob"
service.postBlob(url, data, requestOptions)
```

## 下载保存方法

提供下载方法，可以结合 `getBlob` 和 `postBlob` 返回保存二进制文件

```ts
import { saveAs } from "axios-request";

/**
 * 下载保存 Blob 文件
 * @param blob 二进制文件
 * @param name 文件名
 * @param opts { autoBom } 下载 xml 文件
*/
saveAs(blob: Blob, name: string, opts?: Options)

saveAs(
  new Blob([JSON.stringify(Blob)], {
    type: 'text/plain;charset=utf-8',
  }),
  'blob-data.json'
)
```

## 自定义错误捕获方法

提供内部自定义错误拦截器，过滤不必要的错误展示，例如防抖错误和请求取消错误提示

```ts
import { withErrorHandler } from "axios-request";

/**
 * 封装处理内部自定义错误回调
 * @param err Error
 * @param argus any[]
 * @returns Function
 */
withErrorHandler(error, ..argus)(function errorCallback() {
  console.log(error)
})
```

## 重置实例对象

在有些情况，你可能需要重新配置，这时你可以调用 `create` 方法，它将会重新配置你的 `axios`

```ts
import service from "src/axios/service.ts"

// axiosConfig 为 axios 请求配置，见下文
service.create(axiosConfig)
```

## 配置 axiosConfig

见 <https://www.axios-http.cn/docs/req_config>

## 配置 transform

配置全局的请求处理，在 `createAxios` 作为参数传入

```ts
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
```

## 配置 requestOptions

支持全局配置和请求内配置

```ts
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

export interface DebounceOption {
  delay: number; // 2000
  immediate?: boolean; // 请求回来之后立即触发
}
```
