/// <reference path='../../typings/index.d.ts' />
import {name as coreName} from './core/core.module';
import {name as dashName} from './dash/dash.module';
import {name as mocksName} from './mock/mock.module';
import {config} from './index.config';
import {runBlock} from './index.run';

'use strict';

  angular.module('KS',
    [
      'ngMessages',
      'ui.router',
      'ui.bootstrap',
      coreName,
      dashName,
      mocksName
    ]
  )
    .config(config)
    .service('$', ($window: ng.IWindowService) => $window.$ )
    .run(runBlock);
