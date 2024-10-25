import {DisposableResource} from './disposables.js';

export class RefreshableResource<T = unknown> implements DisposableResource {
  protected timeout: number;
  protected resource: T;
  protected previous: T | null;
  protected refreshFn: (current: T) => Promise<T>;
  protected onRefresh: (resource: T, previous: T) => void;
  protected onError: (error: unknown, current: T) => void;
  protected intervalId: NodeJS.Timeout | null;

  constructor(props: {
    timeout: number;
    resource: T;
    refreshFn: (current: T) => Promise<T>;
    onRefresh: (resource: T, previous: T | null) => void;
    onError: (error: unknown, previous: T | null) => void;
  }) {
    this.timeout = props.timeout;
    this.resource = props.resource;
    this.previous = null;
    this.refreshFn = props.refreshFn;
    this.onRefresh = props.onRefresh;
    this.onError = props.onError;
    this.intervalId = null;
  }

  public start() {
    this.stop();
    this.intervalId = setInterval(() => {
      this.__refresh();
    }, this.timeout);

    return this;
  }

  public stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    return this;
  }

  public getValue() {
    return this.resource;
  }

  public setValue(value: T) {
    this.previous = this.resource;
    this.resource = value;
    return this;
  }

  public getPreviousValue() {
    return this.previous;
  }

  public refresh() {
    this.stop();
    return this.__refresh().finally(() => this.start());
  }

  public getRefreshTimeout() {
    return this.timeout;
  }

  public setRefreshTimeout(timeout: number) {
    this.timeout = timeout;
    return this;
  }

  public getRefreshFn() {
    return this.refreshFn;
  }

  public setRefreshFn(refreshFn: () => Promise<T>) {
    this.refreshFn = refreshFn;
    return this;
  }

  public getOnRefresh() {
    return this.onRefresh;
  }

  public setOnRefresh(onRefresh: (resource: T) => void) {
    this.onRefresh = onRefresh;
    return this;
  }

  public getOnError() {
    return this.onError;
  }

  public setOnError(onError: (error: unknown) => void) {
    this.onError = onError;
    return this;
  }

  public dispose() {
    this.stop();
  }

  protected __refresh() {
    return this.refreshFn(this.resource)
      .then(newResource => {
        this.previous = this.resource;
        this.resource = newResource;
        this.onRefresh(this.resource, this.previous);
      })
      .catch(error => {
        this.onError(error, this.resource);
      });
  }
}
