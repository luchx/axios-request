import { AxiosError, AxiosRequestConfig } from "axios";
import { DebounceOption } from "../types/interface";
import { getPendingUrl } from "../helper/utils";

interface PendingData {
  timestamp: number;
}

// 声明一个 Map 用于存储每个请求的标识
let pendingMap = new Map<string, PendingData>();

export class DebounceError extends AxiosError {
  name = 'DebounceError';
  message = "canceled from debounce";
  __DEBOUNCE_CANCEL__ = true
}

export function debounceCancel(err) {
  return !!(err && err.__DEBOUNCE_CANCEL__);
}

export class AxiosDebounce {
  private debounce: DebounceOption;
  constructor(debounce) {
    this.debounce = Object.assign(
      {},
      {
        delay: 0,
      },
      debounce
    );
  }

  has(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);
    if (!pendingMap.has(url)) {
      return false;
    }
    const data = pendingMap.get(url);
    const date = new Date().getTime();
    return date - data!.timestamp <= this.debounce.delay;
  }

  add(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);
    if (!this.has(config)) {
      pendingMap.set(url, {
        timestamp: new Date().getTime(),
      });
    }
  }

  remove(config: AxiosRequestConfig) {
    const url = getPendingUrl(config);
    if (pendingMap.has(url)) {
      pendingMap.delete(url);
    }
  }
}
