/// <reference path='../../typings/index.d.ts' />
import {name as coreName} from './core/core.module';
import {name as booksName} from './books/books.module';
import {name as mocksName} from './mock/mock.module';
import {config} from './index.config';
import {runBlock} from './index.run';

'use strict';

  angular.module('KS',
    [
      'ui.router',
      'ui.bootstrap',
      'angularFileUpload',
      'ncy-angular-breadcrumb',
      mocksName,
      coreName,
      booksName
    ]
  )
    .config(config)
    .service('$', ($window: ng.IWindowService) => $window.$ )
    .run(runBlock);
