import {GenericController} from '../core/core.entry';
export class BooksController extends GenericController {
  /**@ngInject*/
  constructor(public $injector: ng.auto.IInjectorService, $scope: ng.IScope, $state: ng.ui.IStateService, $stateParams: ng.ui.IStateParamsService, public books: KS.books.IBook[], BooksService: KS.books.IBookService) {
    super($injector, $scope);
    this.books = $stateParams.books || books.result;
    this.deleteBook = (id: string) => {
      BooksService.remove(id).then((response: KS.books.IBooksResponse) => {
        if (response && response.result && response.result.length) {
          $state.go('books.list', null, {reload: true});
        }
      });
    };
  }
}
