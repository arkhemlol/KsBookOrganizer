/**
 * Created by LobanovI on 28.03.2016.
 */
///<reference path="../index.d.ts"/>

declare module KS.core {

  export interface IBuilder<T> {
    build(): T;
  }

  export interface IConfig {
    apiHost: string;
    port: number;
    modules: string[];
    useE2E?: boolean;
  }

  export interface IMocks {
    books: KS.dash.IBook[];
  }

  export interface IHttpReq {
    method?: string;
    headers?: Object;
    data?: any;
    process?: Function;
    params?: Object;
  }

  export interface IPromisifyFnArgs {
    property?: string;
    cookieKey?: string;
    force?: boolean;
  }

  export interface IWatcherContainer {
    add(name: IHashTable<Function>): void;
    add(name: string, watcher?: Function): void;
    add(key: string | IHashTable<Function>, watcher?: Function): void;
    remove(watcherName?: string): void;
  }

  export interface IInjectorService {
    $injector: ng.auto.IInjectorService;
  }

  export interface IGenericController extends IInjectorService {
    $scope?: ng.IScope;
    watchers?: IWatcherContainer;
  }

  export interface IBasicService {
    currentModuleName: string;
  }

  export interface IBasicInjectorService extends IInjectorService, IBasicService {}

  export interface IHashTable<T> {
    [key: string]: T;
  }

  export interface IBasicHttpService extends IInjectorService {
    $q: ng.IQService;
    $cookies?: ng.cookies.ICookiesService;
  }

  export interface IAbstractHttpService extends IBasicHttpService {
    promise: ng.IDeferred<any>;
    promisify<T>(action: Function, options: IPromisifyFnArgs): ng.IPromise<T>;
    clearCookies?(keyName: string | string[]): void;
    handleError(error: ng.IHttpPromiseCallbackArg<any>, handler?: Function): ng.IPromise<any>;
    asyncHandler(response: any): void;
    onReject(classNames: string | string[], keyNames?: string | string[]): void;
  }

  export interface IHttpService extends IAbstractHttpService {
    apiHost: string;
    $get(url: string, options?: KS.core.IHttpReq): ng.IPromise<any>;
    $post(url: string, options?: KS.core.IHttpReq) : ng.IPromise<any>;
    $delete(url: string, options?: KS.core.IHttpReq) : ng.IPromise<any>;
  }

  export interface IRouterHelperProvider {
    $get: any;
    $stateProvider: ng.ui.IStateProvider;
    $urlRouterProvider: ng.ui.IUrlRouterProvider;
    $locationProvider: ng.ILocationProvider;
  }

  export interface IRouterHelperService {
    configureStates(state: ng.ui.IState[], otherWise?: string | Function);
    getStates(): ng.ui.IState[];
  }

  export interface IRouteState {
    name: string;
    config: ng.ui.IState;
  }

  export interface IUtilsService {
    arrayToEnum<T>(arr: string[], enumToCreate: any): T[];
    encode(data: Object): string;
    activator<T>(type: { new(...args: any[]): T; }): Function;
    applyMixins(derivedCtor: any, baseCtors: any[]): void;
    sumEnumValues(enumToSum: any): number;
    flattenStringCollection(collection: Array<any> | Object): string[];
    flattenNumCollection(collection: Array<any> | Object): number[];
    checkBitmask(mask: number, condition: any): boolean;
    checkCollection(collection: Object | Array<any>, item: any): boolean;
    isSameOrigin(url: string, origins?: string | string[]): boolean;
    formatTime(time: string): number;
    stamp(obj: any): number;
    addUid(collection: any): void;
  }

  export interface ICRUDService<T> {
    selectAll?(): ng.IPromise<T[]>;
    selectMany?(ids: string[]): ng.IPromise<T[]>;
    selectOne?(id?: string): ng.IPromise<T>;
    create?(item: T): ng.IPromise<T>;
    update?(id: string, item: T): ng.IPromise<T>;
    remove?(id: string): ng.IPromise<T>;
  }

  export interface ICRUDServiceProvider {
    url: string;
  }

  export interface IValidationService {
    number: RegExp;
    email: RegExp;
    phone: RegExp;
    name: RegExp;
    lastName: RegExp;
    emptyField: RegExp;
    sameFieldVal?: any;
    sameField?(first: any, second: any): boolean;
    initValidators(regexps: string[], modelController: ng.INgModelController, value?: any): void;
  }

  export interface IValidationDirectiveScope extends ng.IScope {
    val: string;
  }
}
