import {CRUDService, CRUDServiceProvider} from '../core/core.entry';

export class BooksService extends CRUDService<KS.books.IBooksResponse> implements KS.books.IBookService {
  /**@ngInject*/
  constructor($injector:ng.auto.IInjectorService, url:string) {
    super($injector, url);
  }

  getBooks(params?:any) {
    return super.selectAll(params).then((response:KS.books.IBooksResponse) => {
      _.each(response.result, (book:KS.books.IBook) => {
        book.publishDate = new Date(<string>book.publishDate);
      });
      return response;
    });
  }

  getBook(id:string) {
    return super.selectOne(id).then((response:KS.books.IBooksResponse) => response.result[0]);
  }
}

export class BooksServiceProvider extends CRUDServiceProvider {

  public static Factory(): BooksServiceProvider {
    return new BooksServiceProvider();
  }

  constructor() {
    super();
  }

  $get = ['$injector', ($injector: ng.auto.IInjectorService): KS.core.ICRUDService<any> => {
    return new BooksService($injector, this.url);
  }];
}
