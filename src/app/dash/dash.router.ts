function getStates(): KS.core.IRouteState[] {
  return [
    {
      name: 'dash',
      config: {
        url: '/dash',
        templateUrl: 'app/dash/dash.html',
        controller: 'DashController',
        controllerAs: 'dash',
        resolve: {
          books: getBooks
        }
      }
    }
  ];
}

export function getBooks(BooksService: KS.dash.IBookService) {
  return BooksService.selectAll();
}

export function dashRun(RouterHelper: KS.core.IRouterHelperService) {
  // second argument is an otherWise route
  RouterHelper.configureStates(getStates(), '/');
}
