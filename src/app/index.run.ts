
export interface ICustomRootScopeService extends ng.IRootScopeService {
  angular: angular.IAngularStatic;
}

/** @ngInject */
export function runBlock($log: angular.ILogService, $rootScope: ng.IRootScopeService) {
  $log.debug('runBlock end');
  (<ICustomRootScopeService>$rootScope).angular = angular;
}
