function getStates(): KS.core.IRouteState[] {
  return [
    {
      name: 'books',
      config: {
        url: '/books',
        abstract: true,
        templateUrl: 'app/books/books.html',
        controller: ['$scope', '$state', 'books', 'BooksService', function ($scope: ng.IScope, $state: ng.ui.IStateService, books: any, BooksService: KS.books.IBookService) {
          this.totalItems = books.count;
          this.currentPage = 1;
          this.itemsPerPage = 3;
          this.onPageChange = (e: any) => {
            console.log(e);
            BooksService.getBooks({page: this.currentPage}).then((response: KS.books.IBooksResponse) => {
              if (response) {
                $state.go('books.list', {books: response.result });
              }
            })
          }
        }],
        controllerAs: 'pag',
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
        params: {books: null},
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
        controller: 'BooksDetailsController',
        resolve: {
          book: ['$q', '$stateParams', 'BooksService', function($q: ng.IQService, $stateParams: ng.ui.IStateParamsService, BooksService: KS.books.IBookService) {
            let defer = $q.defer();
            if ($stateParams.id === 'new') return defer.resolve();
            return $stateParams.book ? defer.resolve($stateParams.book) : BooksService.getBook($stateParams.id);
          }]
        },
        params: {
          book: null
        },
        ncyBreadcrumb: {
          label: '{{ header }}',
          parent: 'books.list'
        }
      }
    },
    {
      name: 'books.detail.author',
      config: {
        url: '/author/:id',
        templateUrl: 'app/books/books.author.html',
        controller: function ($state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService, UtilsService: KS.core.IUtilsService) {
          this.author = $stateParams.author;
          this.book = $stateParams.book ? $stateParams.book : {};
          if (!_.isArray(this.book.authors)) {
            this.book.authors = [];
          }
          this.onAuthorSave = () => {
            let authorIdx = _.findIndex(this.book.authors, {_ks_id: this.author._ks_id});
            if(authorIdx !== -1) {
              this.book.authors.splice(this.book.authors[authorIdx], 1, this.author);
            } else {
              UtilsService.stamp(this.author);
              this.book.authors = this.book.authors.concat(this.author);
            }
            $state.go('books.detail', {id: this.book._ks_id || 'new', book: this.book }, { reload: true });
          }
        },
        controllerAs: 'author',
        params: {
          author: null,
          book: null
        },
        ncyBreadcrumb: {
          label: 'Author {{ author.author.name }} {{ author.author.lastName }}',
          parent: 'books.detail({id: book._ks_id})'
        }
      }
    }
  ];
}

export function getBooks(BooksService: KS.books.IBookService) {
  return BooksService.getBooks();
}

export function booksRun(RouterHelper: KS.core.IRouterHelperService) {
  // second argument is an otherWise route
  RouterHelper.configureStates(getStates(), '/books');
}
