import {HttpService} from './core.http.service';
export class CRUDService<T> extends HttpService implements KS.core.ICRUDService<T> {
  public url: string;
  /**@ngInject */
  constructor($injector: ng.auto.IInjectorService, url: string) {
    super($injector);
    this.url = url;
  }

  selectAll(params?: any) {
    return this.$get(`${this.url}`, {params: params || {} });
  }
  selectOne(id: string) {
    return this.$get(`${this.url}/${id}`);
  }
  create(item: T) {
    return this.$post(`${this.url}`, { data: item });
  }
  update(id: string, item: T) {
    return this.$post(`${this.url}/${id}`, { data: item });
  }
  remove(id: string) {
    return this.$delete(`${this.url}/${id}`);
  }
}

export class CRUDServiceProvider {
  public url: string;

  public static Factory(): CRUDServiceProvider {
    return new CRUDServiceProvider();
  }

  $get = ['$injector', ($injector: ng.auto.IInjectorService): KS.core.ICRUDService<any> => {
    return new CRUDService($injector, this.url);
  }];
}
