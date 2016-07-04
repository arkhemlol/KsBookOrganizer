import {CRUDService, CRUDServiceProvider} from '../core/core.entry';

export class BooksService extends CRUDService<KS.books.IBook> implements KS.books.IBookService {
  /**@ngInject*/
  constructor($injector: ng.auto.IInjectorService, url: string) {
    super($injector, url);
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
    return new CRUDService($injector, this.url);
  }];
}
