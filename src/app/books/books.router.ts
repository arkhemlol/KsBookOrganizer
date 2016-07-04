function getStates(): KS.core.IRouteState[] {
  return [
    {
      name: 'books',
      config: {
        url: '/books',
        abstract: true,
        templateUrl: 'app/books/books.html',
        controller: ($scope: ng.IScope, books: any) => {
          $scope.totalItems = books.count;
          $scope.currentPage = 1;
          $scope.itemsPerPage = 3;
        },
        resolve: {
          books: getBooks
        }
      }
    },
    {
      name: 'books.list',
      config: {
        url: '',
        templateUrl: 'app/books/books.list.html',
        controller: 'BooksController',
        controllerAs: 'books',
        ncyBreadcrumb: {
          label: 'Books'
        }
      }
    },
    {
      name: 'books.detail',
      config: {
        url: '/:id',
        templateUrl: 'app/books/books.detail.html',
        controller: ($scope: ng.IScope, $stateParams: ng.ui.IStateParamsService) => {
          $scope.id = $stateParams.id;
        },
        ncyBreadcrumb: {
          label: '{{ id }}',
          parent: 'books.list({id: book._ks_id})'
        }
      }
    },
    {
      name: 'books.author',
      config: {
        url: '/author/:id',
        templateUrl: 'app/books/books.author.html',
        controller: 'BooksController',
        controllerAs: 'books'
      }
    }
  ];
}

export function getBooks(BooksService: KS.books.IBookService) {
  return BooksService.selectAll();
}

export function booksRun(RouterHelper: KS.core.IRouterHelperService) {
  // second argument is an otherWise route
  RouterHelper.configureStates(getStates(), '/books');
}
