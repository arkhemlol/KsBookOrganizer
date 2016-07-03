import * as mock from './mock.entry';
export let name: string = 'KS.mock';
'use strict';
angular.module('KS.mock', ['KS.config'])
  .config(function(config: KS.core.IConfig, $provide: ng.auto.IProvideService) {
    if (config.useE2E) {
      $provide.decorator('$httpBackend', angular.mock.e2e.$httpBackendDecorator);
    }
  })
  .service('MockService', mock.MockService);
