import {GenericController} from '../core/core.entry';
export class BooksController extends GenericController {
  /**@ngInject*/
  constructor(public $injector: ng.auto.IInjectorService, $scope: ng.IScope, $state: ng.ui.IStateService,
              $stateParams: ng.ui.IStateParamsService, public books: KS.books.IBook[], public localStorageService: any, BooksService: KS.books.IBookService) {
    super($injector, $scope);
    $scope.books = $stateParams.books || books.result;
    $scope.order = this.setInitialOrdering();
    $scope.deleteBook = (id: string) => {
      BooksService.remove(id).then((response: KS.books.IBooksResponse) => {
        if (response && response.result && response.result.length) {
          $state.go('books.list', {books: response.result}, {reload: true});
        }
      });
    };
    $scope.setOrder = (value: any) => {
      $scope.order = value;
      localStorageService.set('ordering', value);
    }
  }
  setInitialOrdering() {
    let ordering;
    return (ordering = this.localStorageService.get('ordering')) ? ordering : this.localStorageService.set('ordering', 'header') && 'header';
  }
}
