/** @ngInject */
export function config($logProvider: angular.ILogProvider, $locationProvider: ng.ILocationProvider) {
  // enable log
  $logProvider.debugEnabled(true);
  $locationProvider.html5Mode(true);
}
