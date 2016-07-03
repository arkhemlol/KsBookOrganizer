export class MockService implements KS.mock.IMockService {
  public API: KS.mock.IAPI;
  public $httpBackend: ng.IHttpBackendService;
  public pagingLength: number = 10;

  /** @ngInject */
  constructor($httpBackend: ng.IHttpBackendService, public config: KS.core.IConfig, public mocks: KS.core.IMocks, public $filter: ng.IFilterService) {
    this.$httpBackend = $httpBackend;
    this.initAPI();
  }

  initAPI() {

    this.API = {};

    this.API.getBooks = () => {
      let self = this;
      return this.$httpBackend.whenRoute('GET', '/books')
        .respond(function(method, url, data, headers, params) {
          var bookList = angular.copy(self.mocks.books),
            defaultSort = 'lastName',
            pages, isPrevious, isNext;

          // paged api response '/v1/books?page=2'
          params.page = Number(params.page) || 1;

          // query for last names '/v1/books?q=Archer'
          if (params.q) {
            bookList = self.$filter('filter')({lastName: params.q});
          }

          pages = Math.ceil(bookList.length / self.pagingLength);
          isPrevious = params.page > 1;
          isNext = params.page < pages;

          return [200, {
            count:    bookList.length,
            previous: isPrevious,
            next:     isNext,
            // sort field -> '/v1/books?sortBy=firstName'
            // results:  $filter('orderBy')(bookList, params.sortBy || defaultSort)
            //   .splice((params.page - 1) * self.pagingLength, self.pagingLength)
            result: bookList.splice((params.page - 1) * self.pagingLength, self.pagingLength)
          }];
        });
    };

    this.API.getBook = () => {
      let self = this;
      return this.$httpBackend.whenRoute('GET', '/books/:id')
        .respond(function (method, url, data, headers, params) {
          return [200, _.find(self.mocks.books, {id: params.id})];
        });
    };

    this.API.passAllGet = () => {
      if (angular.isDefined(this.$httpBackend.expectGET(/[\s\S]*/).passThrough)) {
        this.$httpBackend.resetExpectations();
        return this.$httpBackend.whenGET(/[\s\S]*/).passThrough();
      }
      throw new Error('Do not use real backend in unit tests!');
    };
    this.API.passAllPost = () => {
      if (angular.isDefined(this.$httpBackend.expectGET(/[\s\S]*/).passThrough)) {
        this.$httpBackend.resetExpectations();
        return this.$httpBackend.whenPOST(/[\s\S]*/).passThrough();
      }
      throw new Error('Do not use real backend in unit tests!');
    };
    this.API.passAllHtml = () =>  {
      if (angular.isDefined(this.$httpBackend.expectGET(/[\s\S]*/).passThrough)) {
        this.$httpBackend.resetExpectations();
        return this.$httpBackend.whenGET(/.*\.html$/).passThrough();
      }
      throw new Error('Do not use real backend in unit tests!');
    };
  }

  run() {
    _.forOwn(this.API, (apiMethod: () => ng.mock.IRequestHandler) => {
      apiMethod.call(this);
    }, this);
  };
}
