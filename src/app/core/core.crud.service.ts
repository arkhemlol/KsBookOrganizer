import {HttpService} from './core.http.service';
import {UtilsService} from './core.utils.service';
export class CRUDService<T> extends HttpService implements KS.core.ICRUDService<T> {
  public url: string;
  public utils: KS.core.IUtilsService;
  /**@ngInject */
  constructor($injector: ng.auto.IInjectorService, url: string) {
    super($injector);
    this.url = url;
    this.utils = new UtilsService();
  }

  selectAll() {
    return this.$get(`${this.url}`).then((objects: any) => {
      if(objects && _.isArray(objects.result)) {
        _.each(objects.result, this.utils.addUid);
        return this.$q.when(objects);
      }
      return objects;
    });
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
