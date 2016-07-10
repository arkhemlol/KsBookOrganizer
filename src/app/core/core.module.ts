import * as core from './core.entry';
import {name as configName} from '../config';
export let name: string = 'KS.core';
'use strict';
angular.module('KS.core', ['ui.router', 'ngCookies', configName])
  .provider('RouterHelper', core.RouterHelperProviderFactory)
  .provider('CRUDService', core.CRUDServiceProvider.Factory())
  .service('HttpService', core.HttpService)
  .service('UtilsService', core.UtilsService)
  .service('CRUD', core.CRUDService)
  .config((CRUDServiceProvider: KS.core.ICRUDServiceProvider) => {
    CRUDServiceProvider.url = '';
  })
  .run(core.coreRun);
