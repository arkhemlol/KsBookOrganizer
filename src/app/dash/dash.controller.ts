import {GenericController} from '../core/core.entry';
export class DashController extends GenericController {
  /**@ngInject*/
  constructor(public $injector: ng.auto.IInjectorService, $scope: ng.IScope, public books: KS.dash.IBook[]) {
    super($injector, $scope);
    this.books = books.result;
    this.currentPage = 1;
    this.totalItems = books.count;
  }
}
