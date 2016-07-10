export class MockService implements KS.mock.IMockService {
  public API: KS.mock.IAPI;
  public $httpBackend: ng.IHttpBackendService;
  public pagingLength: number = 3;
  public storage: KS.books.IBook[];

  /** @ngInject */
  constructor($httpBackend: ng.IHttpBackendService, public config: KS.core.IConfig, public localStorageService: any, public mocks: KS.core.IMocks, public $filter: ng.IFilterService) {
    if(!localStorageService.length()) {
      _.each(this.mocks.books, (obj: KS.books.IBook) => localStorageService.set(parseInt(obj._ks_id), obj));
    }
    this.storage = _.map(localStorageService.keys(), localStorageService.get);
    this.$httpBackend = $httpBackend;
    this.initAPI();
  }

  initAPI() {

    this.API = {};

    this.API.getBook = () => {
      let self = this;
      return this.$httpBackend.whenRoute('GET', '/books/:id')
        .respond(function (method, url, data, headers, params) {
          let result = _.find(self.storage, {_ks_id: parseInt(params.id)});
          return [200, {
            count: result && [result] || 0,
            previous: false,
            next: false,
            result: result && [result] || []
          }];
        });
    };

    this.API.updateBook = () => {
      let self = this;
      return this.$httpBackend.whenRoute('POST', '/books/:id')
        .respond(function (method, url, data, headers, params) {
          try {
            data = JSON.parse(data);
          } catch(e) {
            return [500, {}, {message: 'Invalid data'}, 'Invalid data'];
          }
          if (data && data._ks_id) {
            let idx = _.findIndex(self.storage, {_ks_id: parseInt(data._ks_id)});
            if(idx !== -1) {
              self.storage[idx] = data;
              self.localStorageService.set(data._ks_id, data);
            }
          }
          let pages = Math.ceil(self.storage.length / self.pagingLength);
          let isPrevious = params.page > 1;
          let isNext = params.page < pages;
          return [200, {
            count: self.storage.length,
            previous: isPrevious,
            next: isNext,
            result: self.storage
          }];
        });
    };

    this.API.createBook = () => {
      let self = this;
      return this.$httpBackend.whenRoute('POST', '/books')
        .respond(function (method, url, data, headers, params) {
          try {
            data = JSON.parse(data);
          } catch(e) {
            return [500, {}, {message: 'Invalid data'}, 'Invalid data'];
          }
          if (data && data._ks_id) {
            data._ks_id = parseInt(data._ks_id);
            self.storage = self.storage.concat(data);
            self.localStorageService.set(data._ks_id, data);
          }
          let pages = Math.ceil(self.storage.length / self.pagingLength);
          let isPrevious = params.page > 1;
          let isNext = params.page < pages;
          return [200, {
            count: self.storage.length,
            previous: isPrevious,
            next: isNext,
            result: self.storage
          }];
        });
    };

    this.API.deleteBook = () => {
      let self = this;
      return this.$httpBackend.whenRoute('DELETE', '/books/:id')
        .respond(function (method, url, data, headers, params) {
          let result = _.remove(self.storage, {_ks_id: parseInt(params.id)});
          if(result && result[0]) {
            self.localStorageService.remove(result[0]._ks_id);
          }
          return [200, {
            count: result.length,
            previous: false,
            next: false,
            result: result
          }];
        });
    };

    this.API.getBooks = () => {
      let self = this;
      return this.$httpBackend.whenRoute('GET', '/books')
        .respond(function(method, url, data, headers, params) {
          params.page = Number(params.page) || 1;
          let start = (params.page - 1) * self.pagingLength,
              bookList = self.storage.slice(start, start + self.pagingLength),
              defaultSort = 'lastName',
              pages, isPrevious, isNext;

          // query for last names '/v1/books?q=Archer'
          if (params.q) {
            bookList = self.$filter('filter')({lastName: params.q});
          }

          pages = Math.ceil(bookList.length / self.pagingLength);
          isPrevious = params.page > 1;
          isNext = params.page < pages;

          return [200, {
            count:    self.storage.length,
            previous: isPrevious,
            next:     isNext,
            result: bookList
          }];
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
