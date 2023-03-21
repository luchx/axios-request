// TypeScript Version: 4.7
type AxiosHeaderValue = AxiosHeaders | string | string[] | number | boolean | null;

interface RawAxiosHeaders {
  [key: string]: AxiosHeaderValue;
}

type MethodsHeaders = Partial<{
  [Key in Method as Lowercase<Key>]: AxiosHeaders;
} & {common: AxiosHeaders}>;

type AxiosHeaderMatcher = (this: AxiosHeaders, value: string, name: string, headers: RawAxiosHeaders) => boolean;

declare class AxiosHeaders {
  constructor(
      headers?: RawAxiosHeaders | AxiosHeaders
  );

  [key: string]: any;

  set(headerName?: string, value?: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  set(headers?: RawAxiosHeaders | AxiosHeaders, rewrite?: boolean): AxiosHeaders;

  get(headerName: string, parser: RegExp): RegExpExecArray | null;
  get(headerName: string, matcher?: true | AxiosHeaderMatcher): AxiosHeaderValue;

  has(header: string, matcher?: true | AxiosHeaderMatcher): boolean;

  delete(header: string | string[], matcher?: AxiosHeaderMatcher): boolean;

  clear(matcher?: AxiosHeaderMatcher): boolean;

  normalize(format: boolean): AxiosHeaders;

  concat(...targets: Array<AxiosHeaders | RawAxiosHeaders | string | undefined | null>): AxiosHeaders;

  toJSON(asStrings?: boolean): RawAxiosHeaders;

  static from(thing?: AxiosHeaders | RawAxiosHeaders | string): AxiosHeaders;

  static accessor(header: string | string[]): AxiosHeaders;

  static concat(...targets: Array<AxiosHeaders | RawAxiosHeaders | string | undefined | null>): AxiosHeaders;

  setContentType(value: ContentType, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getContentType(parser?: RegExp): RegExpExecArray | null;
  getContentType(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasContentType(matcher?: AxiosHeaderMatcher): boolean;

  setContentLength(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getContentLength(parser?: RegExp): RegExpExecArray | null;
  getContentLength(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasContentLength(matcher?: AxiosHeaderMatcher): boolean;

  setAccept(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getAccept(parser?: RegExp): RegExpExecArray | null;
  getAccept(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasAccept(matcher?: AxiosHeaderMatcher): boolean;

  setUserAgent(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getUserAgent(parser?: RegExp): RegExpExecArray | null;
  getUserAgent(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasUserAgent(matcher?: AxiosHeaderMatcher): boolean;

  setContentEncoding(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getContentEncoding(parser?: RegExp): RegExpExecArray | null;
  getContentEncoding(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasContentEncoding(matcher?: AxiosHeaderMatcher): boolean;

  setAuthorization(value: AxiosHeaderValue, rewrite?: boolean | AxiosHeaderMatcher): AxiosHeaders;
  getAuthorization(parser?: RegExp): RegExpExecArray | null;
  getAuthorization(matcher?: AxiosHeaderMatcher): AxiosHeaderValue;
  hasAuthorization(matcher?: AxiosHeaderMatcher): boolean;

  [Symbol.iterator](): IterableIterator<[string, AxiosHeaderValue]>;
}

type CommonRequestHeadersList = 'Accept' | 'Content-Length' | 'User-Agent' | 'Content-Encoding' | 'Authorization';

type ContentType = AxiosHeaderValue | 'text/html' | 'text/plain' | 'multipart/form-data' | 'application/json' | 'application/x-www-form-urlencoded' | 'application/octet-stream';

type RawAxiosRequestHeaders = Partial<RawAxiosHeaders & {
  [Key in CommonRequestHeadersList]: AxiosHeaderValue;
} & {
  'Content-Type': ContentType
}>;

type AxiosRequestHeaders = RawAxiosRequestHeaders & AxiosHeaders;

type CommonResponseHeadersList = 'Server' | 'Content-Type' | 'Content-Length' | 'Cache-Control'| 'Content-Encoding';

type RawCommonResponseHeaders = {
  [Key in CommonResponseHeadersList]: AxiosHeaderValue;
} & {
  "set-cookie": string[];
};

type RawAxiosResponseHeaders = Partial<RawAxiosHeaders & RawCommonResponseHeaders>;

type AxiosResponseHeaders = RawAxiosResponseHeaders & AxiosHeaders;

interface AxiosRequestTransformer {
  (this: InternalAxiosRequestConfig, data: any, headers: AxiosRequestHeaders): any;
}

interface AxiosResponseTransformer {
  (this: InternalAxiosRequestConfig, data: any, headers: AxiosResponseHeaders, status?: number): any;
}

interface AxiosAdapter {
  (config: InternalAxiosRequestConfig): AxiosPromise;
}

interface AxiosBasicCredentials {
  username: string;
  password: string;
}

interface AxiosProxyConfig {
  host: string;
  port: number;
  auth?: {
    username: string;
    password: string;
  };
  protocol?: string;
}

type Method =
    | 'get' | 'GET'
    | 'delete' | 'DELETE'
    | 'head' | 'HEAD'
    | 'options' | 'OPTIONS'
    | 'post' | 'POST'
    | 'put' | 'PUT'
    | 'patch' | 'PATCH'
    | 'purge' | 'PURGE'
    | 'link' | 'LINK'
    | 'unlink' | 'UNLINK';

type ResponseType =
    | 'arraybuffer'
    | 'blob'
    | 'document'
    | 'json'
    | 'text'
    | 'stream';

type responseEncoding =
    | 'ascii' | 'ASCII'
    | 'ansi' | 'ANSI'
    | 'binary' | 'BINARY'
    | 'base64' | 'BASE64'
    | 'base64url' | 'BASE64URL'
    | 'hex' | 'HEX'
    | 'latin1' | 'LATIN1'
    | 'ucs-2' | 'UCS-2'
    | 'ucs2' | 'UCS2'
    | 'utf-8' | 'UTF-8'
    | 'utf8' | 'UTF8'
    | 'utf16le' | 'UTF16LE';

interface TransitionalOptions {
  silentJSONParsing?: boolean;
  forcedJSONParsing?: boolean;
  clarifyTimeoutError?: boolean;
}

interface GenericAbortSignal {
  readonly aborted: boolean;
  onabort?: ((...args: any) => any) | null;
  addEventListener?: (...args: any) => any;
  removeEventListener?: (...args: any) => any;
}

interface FormDataVisitorHelpers {
  defaultVisitor: SerializerVisitor;
  convertValue: (value: any) => any;
  isVisitable: (value: any) => boolean;
}

interface SerializerVisitor {
  (
      this: GenericFormData,
      value: any,
      key: string | number,
      path: null | Array<string | number>,
      helpers: FormDataVisitorHelpers
  ): boolean;
}

interface SerializerOptions {
  visitor?: SerializerVisitor;
  dots?: boolean;
  metaTokens?: boolean;
  indexes?: boolean | null;
}

// tslint:disable-next-line
interface FormSerializerOptions extends SerializerOptions {
}

interface ParamEncoder {
  (value: any, defaultEncoder: (value: any) => any): any;
}

interface CustomParamsSerializer {
  (params: Record<string, any>, options?: ParamsSerializerOptions): string;
}

interface ParamsSerializerOptions extends SerializerOptions {
  encode?: ParamEncoder;
  serialize?: CustomParamsSerializer;
}

type MaxUploadRate = number;

type MaxDownloadRate = number;

type BrowserProgressEvent = any;

interface AxiosProgressEvent {
  loaded: number;
  total?: number;
  progress?: number;
  bytes: number;
  rate?: number;
  estimated?: number;
  upload?: boolean;
  download?: boolean;
  event?: BrowserProgressEvent;
}

type Milliseconds = number;

type AxiosAdapterName = 'xhr' | 'http' | string;

type AxiosAdapterConfig = AxiosAdapter | AxiosAdapterName;

interface AxiosRequestConfig<D = any> {
  url?: string;
  method?: Method | string;
  baseURL?: string;
  transformRequest?: AxiosRequestTransformer | AxiosRequestTransformer[];
  transformResponse?: AxiosResponseTransformer | AxiosResponseTransformer[];
  headers?: (RawAxiosRequestHeaders & MethodsHeaders) | AxiosHeaders;
  params?: any;
  paramsSerializer?: ParamsSerializerOptions;
  data?: D;
  timeout?: Milliseconds;
  timeoutErrorMessage?: string;
  withCredentials?: boolean;
  adapter?: AxiosAdapterConfig | AxiosAdapterConfig[];
  auth?: AxiosBasicCredentials;
  responseType?: ResponseType;
  responseEncoding?: responseEncoding | string;
  xsrfCookieName?: string;
  xsrfHeaderName?: string;
  onUploadProgress?: (progressEvent: AxiosProgressEvent) => void;
  onDownloadProgress?: (progressEvent: AxiosProgressEvent) => void;
  maxContentLength?: number;
  validateStatus?: ((status: number) => boolean) | null;
  maxBodyLength?: number;
  maxRedirects?: number;
  maxRate?: number | [MaxUploadRate, MaxDownloadRate];
  beforeRedirect?: (options: Record<string, any>, responseDetails: {headers: Record<string, string>}) => void;
  socketPath?: string | null;
  httpAgent?: any;
  httpsAgent?: any;
  proxy?: AxiosProxyConfig | false;
  cancelToken?: CancelToken;
  decompress?: boolean;
  transitional?: TransitionalOptions;
  signal?: GenericAbortSignal;
  insecureHTTPParser?: boolean;
  env?: {
    FormData?: new (...args: any[]) => object;
  };
  formSerializer?: FormSerializerOptions;
}

interface InternalAxiosRequestConfig<D = any> extends AxiosRequestConfig<D> {
  headers: AxiosRequestHeaders;
}

interface AxiosResponse<T = any, D = any> {
  data: T;
  status: number;
  statusText: string;
  headers: RawAxiosResponseHeaders | AxiosResponseHeaders;
  config: InternalAxiosRequestConfig<D>;
  request?: any;
}

type AxiosPromise<T = any> = Promise<AxiosResponse<T>>;

interface Cancel {
  message: string | undefined;
}

interface CancelToken {
  promise: Promise<Cancel>;
  reason?: Cancel;
  throwIfRequested(): void;
}

interface GenericFormData {
  append(name: string, value: any, options?: any): any;
}

interface ResponseData<T = any> {
    errcode: number;
    errmsg: string;
    data?: T;
}
interface DebounceOption {
    delay: number;
    immediate?: boolean;
}
interface RequestOptions {
    isShowErrorTips?: Boolean;
    isDirectResponse?: boolean;
    isCancelDuplicate?: boolean;
    isRequestJson?: boolean;
    debounce?: DebounceOption;
}
interface CreateAxiosOptions extends AxiosRequestConfig {
    transform?: AxiosTransform;
    requestOptions?: RequestOptions;
}
interface AxiosRequestConfigGlobal<D = any> extends InternalAxiosRequestConfig<D>, RequestOptions {
}
declare abstract class AxiosTransform {
    /**
     * @description: 请求之前处理配置
     * @description: Process configuration before request
     */
    beforeRequestHook?: (config: AxiosRequestConfig, options: RequestOptions) => AxiosRequestConfig;
    /**
     * @description: 请求之后处理配置
     * @description: Process configuration after request
     */
    afterRequestHook?: () => void;
    /**
     * @description: 格式化响应数据
     */
    formatResponseData?: (response: ResponseData, options: RequestOptions) => ResponseData;
    /**
     * @description: 错误提示回调方法
     */
    errorTipsCallback?: (error: Error | ResponseData, isFromError: any) => void;
    /**
     * @description: 请求之前的拦截器
     */
    requestInterceptors?: (config: AxiosRequestConfigGlobal, options: CreateAxiosOptions) => AxiosRequestConfigGlobal;
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

declare class AxiosInstall {
    private axiosInstance;
    private options;
    constructor(options: CreateAxiosOptions);
    /**
     * 配置处理请求拦截器
     * @returns
     */
    private setupAxiosInterceptors;
    /**
     * @description:  创建axios实例
     */
    create(options: CreateAxiosOptions): void;
    request<T = any>(axiosConfig: CreateAxiosOptions, options?: RequestOptions): Promise<any>;
    get(url: string, params?: object, options?: RequestOptions): Promise<any>;
    post(url: string, data?: object, options?: RequestOptions): Promise<any>;
    put(url: string, data?: object, options?: RequestOptions): Promise<any>;
    delete(url: string, params?: object, options?: RequestOptions): Promise<any>;
    getBlob(url: string, params?: object, options?: RequestOptions): Promise<any>;
    postBlob(url: string, data?: object, options?: RequestOptions): Promise<any>;
}

interface Options {
    autoBom?: boolean;
}
type SaveAs = ((blob: Blob, name?: string, opts?: Options) => void) | ((blob: Blob, name: string, opts?: Options | undefined, popup?: Window | null | undefined) => void);
declare const saveAs: SaveAs;

/**
 * 封装处理内部自定义错误回调
 * @param err Error
 * @param argus any[]
 * @returns Function
 */
declare const withErrorHandler: (err: Error, ...argus: any[]) => (callback?: Function) => void;

declare function createAxios(options: CreateAxiosOptions): AxiosInstall;

export { createAxios, createAxios as default, saveAs, withErrorHandler };
