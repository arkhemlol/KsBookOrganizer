import {ServiceFabric} from './core.base';

'use strict';

  /**
   * @class HttpReqBuilder
   * @desc Used to construct http requests with given fields. Utilizes 'Builder' pattern.
   * @constructor url Accepts url
   */
  export class HttpReqBuilder implements KS.core.IBuilder<HttpReq> {
    private url: string;
    private method: string;
    private params: Object;
    private data: any;
    private headers: any;
    private process: Function;

    constructor(url: string) {
      this.url = url;
    }

    get Url(): string {
      return this.url;
    }

    public setUrl(url: string): HttpReqBuilder {
      this.url = url;
      return this;
    }

    get Method(): string {
      return this.method;
    }

    public setMethod(method: string): HttpReqBuilder {
      this.method = method;
      return this;
    }

    get Params(): Object {
      return this.params;
    }

    public setParams(params: Object) {
      if (params) {
        this.params = params;
      }
      return this;
    }

    get Headers(): any {
      return this.headers;
    }

    public setHeaders(headers: any): HttpReqBuilder {
      if (headers) {
        this.headers = headers;
      }
      return this;
    }

    get Process(): Function {
      return this.process;
    }

    public setProcess(processFunc: Function): HttpReqBuilder {
      if (processFunc) {
        this.process = processFunc;
      }
      return this;
    }

    get Data(): string {
      return typeof this.process === 'function' ? this.process(this.data) : this.data;
    }

    public setData(data: any): HttpReqBuilder {
      if (data) {
        this.data = data;
      }
      return this;
    }

    public build(): HttpReq {
      return new HttpReq(this);
    }
  }

  class HttpReq implements KS.core.IHttpReq {
    public url: string;
    public method: string;
    public headers: Object;
    public data: any;
    public params: Object;
    public process: Function;

    constructor(builder: HttpReqBuilder) {
      this.url = builder.Url;
      this.method = builder.Method;
      this.data = builder.Data;
      this.headers = builder.Headers;
      this.process = builder.Process;
      this.data = builder.Data;
      this.params = builder.Params;
    }
  }

  export abstract class AbstractHttpService extends ServiceFabric implements KS.core.IAbstractHttpService {
    protected $http: ng.IHttpService;
    public $q: ng.IQService;
    public $cookies: ng.cookies.ICookiesService;
    public promise: ng.IDeferred<any>;

    constructor($injector: ng.auto.IInjectorService) {
      super($injector);
      this.$http = this.$injector.get<ng.IHttpService>('$http');
      this.$q = this.$injector.get<ng.IQService>('$q');
      this.$cookies = this.$injector.get<ng.cookies.ICookiesService>('$cookies');
    }

    /**
     * Generic wrapper function used to provide callback-style function with Promise interface
     * @param action Required parameter. Async callback-style function
     * Also accepts several options:
     * @param options Options to pass in
     * @param [options.force] Force http-request (used in unit tests or against caching)
     * @param [options.property] Callback result will be saved in this instance property
     * @param [options.cookieKey] Callback result also will be saved in browser cookies under this key
     * @returns {Promise} Promise interface
     * @desc If property was provided and the result of async callback-function has been already stored in this field,
     * then promise will be resolved with it's value.
     * If cookieKey was provided and the result of async callback-function has been stored under this cookie key,
     * then promise will be resolved with it's value.
     * Otherwise, wrapper function will invoke async callback style-function, wait for it's promise to fulfill and resolves it.
     * If property was specified, it will save it's result in this field.
     * If cookieKey was specified, it will also save it's result in cookies.
     * If some client code has invoked this wrapper when async callback-style function is still in progress, the wrapper returns initial promise
     * The client code will also receive promise's result when it's done
     */
    promisify = <T>(action: Function, options?: KS.core.IPromisifyFnArgs): ng.IPromise<T> => {
      var valueFromCookies: any = this.$cookies.getObject(options.cookieKey),
        classNameVal: any = this[options.property];
      if (this.promise && this._promiseInvoked) {
        return this.promise.promise;
      }
      this.promise = this.$q.defer();
      if (classNameVal && !options.force) {
        this._promiseInvoked = false;
        this.promise.resolve(classNameVal);
      } else if (valueFromCookies && options.property && !options.force) {
        this._promiseInvoked = false;
        this.promise.resolve(this[options.property] = valueFromCookies);
      } else {
        this._promiseInvoked = true;
        return action.call(this).then((response: any) => {
          this._promiseInvoked = false;
          this._mapResponseToClassField<T>(response, options.property);
          if (options.cookieKey) {
            this.$cookies.putObject(options.cookieKey, this[options.property]);
          }
          return this.promise.promise;
        }).catch(this.onCatch.bind(this));
      }
      return this.promise.promise;
    };

    /**
     * Generic async function handler. Used for async functions which don't implement Promise interface
     * @param response Response data derived from async function
     */
    asyncHandler = (response: any) => {
      return response ? this.promise.resolve(response) : this.promise.reject(response);
    };
    /**
     * Indicates whether callback-style async function has been already invoked in {@link promisify} method
     * If true {@link promisify} method immediately returns promise
     * @type {boolean}
     * @private
     */
    private _promiseInvoked: boolean = false;
    /**
     * Maps given response object to desired property, if provided, and resolves promise
     * This function just addresses several possible response object's form types
     * @param response Response object derived from the API call
     * @param [property] Instance property to map response
     * @private
     */
    protected _mapResponseToClassField<T>(response: any, property?: string): void {
      var data: T;
      if (response && response.data && !response.data.data) {
        data = <T>response.data;
      } else if (response && !response.data) {
        data = <T>response;
      } else {
        data = <T>response.data.data;
      }
      if (property) {
        this[property] = data;
      }
      this.promise.resolve(data);
    };

    /**
     * Clears value from a cookie by a given key and an instance field value,
     * if property was also specified
     * @param keyNames
     */
    clearCookies(keyNames: string | string[]): void {
      keyNames = _.isString(keyNames) ? [keyNames] : keyNames;
      _.each(keyNames, this.$cookies.remove, this);
    }

    /**
     * This method should be invoked when promise has been rejected
     * @param classFields
     * @param [keyNames]
    */
    onReject(classFields: string[], keyNames?: string[]): void {
      if (keyNames) {
        _.each(keyNames, this.clearCookies, this);
      }
      _.each(classFields, (field: string) => {
        delete this[field];
      }, this);
    }

    onCatch(reason: any) {
      this._promiseInvoked = false;
      return this.promise.reject(reason);
    }


    /**
     * Generic error handler invokes when error is occurred in any async query
     * Accepts optional callback to handle error (i.e. show modal window)
     * @param error
     * @param handler
     * @returns {IPromise<any>}
     */
    handleError(error: ng.IHttpPromiseCallbackArg<any>, handler?: Function): ng.IPromise<any> {
      return this.$q.reject( handler ? handler(error.data) : error.data );
    };
  }

export class HttpService extends AbstractHttpService implements KS.core.IHttpService {
    public apiHost: string;
    public $http: ng.IHttpService;

    constructor($injector: ng.auto.IInjectorService) {
      super($injector);
      let config = this.$injector.get<KS.core.IConfig>('config');
      this.apiHost = config.apiHost;
    }

  $get(url:string, options?:KS.core.IHttpReq, sameDomain?:boolean):ng.IPromise<any> {
    let reqOptions = new HttpReqBuilder(sameDomain ? '/' + url : this.apiHost + url)
      .setMethod('GET')
      .setParams(options && options.params)
      .setHeaders(options && options.headers)
      .build();
    return this.$http(reqOptions)
      .then((response:ng.IHttpPromiseCallbackArg<any>):ng.IPromise<any> => {
        return response.data;
      })
      .catch((error:ng.IHttpPromiseCallbackArg<any>) => {
        return this.handleError(error);
      });
  }

  $post(url:string, options?:KS.core.IHttpReq, sameDomain?:boolean):ng.IPromise<any> {
    let reqOptions = new HttpReqBuilder(sameDomain ? '/' + url : this.apiHost + url)
      .setMethod('POST')
      .setHeaders(options && options.headers ? options.headers : null)
      .setProcess(options && options.process)
      .setData(options && options.data)
      .build();
    return this.$http(reqOptions)
      .then((response:ng.IHttpPromiseCallbackArg<any>):ng.IPromise<any> => {
        return response.data;
      })
      .catch((error:ng.IHttpPromiseCallbackArg<any>) => {
        return this.handleError(error);
      });
  }

  $delete(url:string, options?:KS.core.IHttpReq, sameDomain?:boolean):ng.IPromise<any> {
    let reqOptions = new HttpReqBuilder(sameDomain ? '/' + url : this.apiHost + url)
      .setMethod('DELETE')
      .setHeaders(options && options.headers ? options.headers : null)
      .setProcess(options && options.process)
      .build();
    return this.$http(reqOptions)
      .then((response:ng.IHttpPromiseCallbackArg<any>):ng.IPromise<any> => {
        return response.data;
      })
      .catch((error:ng.IHttpPromiseCallbackArg<any>) => {
        return this.handleError(error);
      });
  }
}
