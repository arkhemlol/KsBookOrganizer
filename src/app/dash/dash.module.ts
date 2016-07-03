import * as dash from './dash.entry';
import {name as coreName} from '../core/core.module';
export let name: string = 'KS.dash';
'use strict';
angular.module('KS.dash', [coreName])
  .provider('BooksService', dash.BooksServiceProvider.Factory)
  .service('Books', dash.BooksService)
  .controller('DashController', dash.DashController)
  .directive('book', dash.BookDirective.Factory())
  .config((BooksServiceProvider: KS.core.ICRUDServiceProvider) => {
    BooksServiceProvider.url = 'books';
  })
  .run(dash.dashRun);
