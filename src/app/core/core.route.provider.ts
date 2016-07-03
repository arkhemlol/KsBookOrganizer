'use strict';

export class RouterHelperService implements KS.core.IRouterHelperService {
  public $state: ng.ui.IStateService;
  private context: RouterHelperProvider;
  constructor($state: ng.ui.IStateService, context: RouterHelperProvider) {
    this.$state = $state;
    this.context = context;
  }
  configureStates(states: KS.core.IRouteState[], otherWise?: any) {
    if (_.isArray(states)) {
      states.forEach((state: KS.core.IRouteState) => {
        this.context.$stateProvider.state(state.name, state.config);
      }, this);
    }
    if (otherWise && !this.context.hasOtherWise) {
      this.context.hasOtherWise = true;
      this.context.$urlRouterProvider.otherwise(otherWise);
    }
  }
  getStates(): ng.ui.IState[] {
    return this.$state.get();
  }
}

export function RouterHelperProviderFactory ($stateProvider: ng.ui.IStateProvider, $urlRouterProvider: ng.ui.IUrlRouterProvider,
                                             $locationProvider: ng.ILocationProvider) {
  return new RouterHelperProvider($stateProvider, $urlRouterProvider, $locationProvider);
}

RouterHelperProviderFactory.$inject = ['$stateProvider', '$urlRouterProvider', '$locationProvider'];

class RouterHelperProvider implements KS.core.IRouterHelperProvider {
  public $stateProvider: ng.ui.IStateProvider;
  public $urlRouterProvider: ng.ui.IUrlRouterProvider;
  public $locationProvider: ng.ILocationProvider;
  public hasOtherWise: boolean;

  constructor($stateProvider: ng.ui.IStateProvider,
              $urlRouterProvider: ng.ui.IUrlRouterProvider, $locationProvider: ng.ILocationProvider) {
    this.$stateProvider = $stateProvider;
    this.$urlRouterProvider = $urlRouterProvider;
    this.$locationProvider = $locationProvider;
    this.hasOtherWise = false;
  }

  public $get = ['$state', ($state: ng.ui.IStateService): KS.core.IRouterHelperService => {
    return new RouterHelperService($state, this);
  }];
}

export function coreRun($injector: ng.auto.IInjectorService) {
  try {
    // trying to inject MockService
    let MockService: KS.mock.IMockService = $injector.get<KS.mock.IMockService>('MockService');
    let $httpBackend: ng.IHttpBackendService = $injector.get<ng.IHttpBackendService>('$httpBackend');
    // the order of this is crucial as ngMock's $httpBackend service has no `passThrough` method
    $httpBackend.whenGET(/.*\.html$/).passThrough();
    $httpBackend.whenGET(/.*\.*json$/).passThrough();
    // we are in e2e mode, run httpBackend mocks
    MockService.run();
    console.log('No real backend is present, using MockService!');
  } catch (e) {
    // using real backend
   }
}

