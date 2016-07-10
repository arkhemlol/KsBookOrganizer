import * as mock from './mock.entry';
export let name: string = 'KS.mock';
'use strict';
angular.module('KS.mock', ['LocalStorageModule', 'KS.config'])
  .config(function(config: KS.core.IConfig, $provide: ng.auto.IProvideService, localStorageServiceProvider: any) {
    if (config.useE2E) {
      $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }
    localStorageServiceProvider
      .setPrefix('KS');
  })
  .service('MockService', mock.MockService);
