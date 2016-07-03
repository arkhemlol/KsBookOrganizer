'use strict';

export class ServiceFabric implements KS.core.IInjectorService {
  public $injector: ng.auto.IInjectorService;
  public static Factory<T extends ServiceFabric>(): Function {
    let t = new this(angular.injector());
    return (): T => {
      return <T>t;
    };
  }
  constructor($injector: ng.auto.IInjectorService) {
    this.$injector = $injector;
  }
}

export class Singleton {
  private static instance: Singleton;

  static get Instance() {
    if (this.instance === null || this.instance === undefined) {
      this.instance = new Singleton();
    }
    return this.instance;
  }
}

export class WatchContainer implements KS.core.IWatcherContainer {
  private watchers: KS.core.IHashTable<Function> = {};
  private $scope: ng.IScope;
  constructor(scope: ng.IScope) {
    this.$scope = scope;
  }
  public add(name: KS.core.IHashTable<Function>): void;
  public add(name: string, watcher?: Function): void;
  public add(key: string | KS.core.IHashTable<Function>, watcher?: Function): void {
    if (typeof name === 'string' && watcher) {
      this.watchers[name] = watcher;
    } else {
      _.extend(this.watchers, key);
    }
  }

  public remove(watcherName?: string): void {
    if (!watcherName) {
      _.each(this.watchers, (name: string) => {
        this.watchers[name].call(null);
      }, this);
      this.watchers = {};
    } else {
      this.watchers[watcherName].call(null);
      delete this.watchers[watcherName];
    }
  }
}

export class GenericController implements KS.core.IGenericController {
  public $injector: ng.auto.IInjectorService;
  public $scope: ng.IScope;
  public watchers: WatchContainer;
  public error: {error?: any, message: string};
  constructor($injector: ng.auto.IInjectorService, scope: ng.IScope) {
    this.$injector = $injector;
    this.$scope = scope;
    this.watchers = new WatchContainer(this.$scope);
    this.$scope.$on('destroy', () => {
        this.watchers.remove();
    });
  }
}

