/**
 * Created by arkhemlol on 10.07.2016.
 */
export class BooksDetailsController {
  /**@ngInject*/
  constructor($scope:ng.IScope, $state: ng.ui.IState, $rootScope: ng.IRootScopeService, $stateParams: ng.ui.IStateParamsService, FileUploader:any, BooksService: KS.books.IBookService, book: KS.books.IBook) {
    book = $stateParams.book || book || {};
    $scope.header = book && book.header || 'New book';
    $scope.book = book;
    $scope.deleteAuthor = (author: KS.books.IAuthor) => {
      _.remove($scope.book.authors, {_ks_id: author._ks_id});
      $state.go('books.detail', {book: $scope.book, id: $scope.book._ks_id}, {reload: true});
    };
    let uploader = $scope.uploader = new FileUploader({
      queueLimit: 1
    });

    let onSuccessCb = (response: KS.books.IBooksResponse) => {
      if (response.result) {
        $state.go('books.list', null, {reload: true});
      }
    };
    let onErrorCb = (error: any) => console.log('Something went wrong');

    // FILTERS

    uploader.filters.push({
      name: 'imageFilter',
      fn: function (item /*{File|FileLikeObject}*/, options) {
        var type = '|' + item.type.slice(item.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      }
    });
    uploader.filters.push({
      'name': 'enforceMaxFileSize',
      'fn': function (item) {
        return item.size <= 1048576; // 1 MiB to bytes
      }
    });
    $rootScope.$on('KS.imageUploaded', (event: ng.IAngularEvent, data: {file: string}) => {
      $scope.book.img = data.file;
    });
    $scope.onBookSave = () => {
      if($scope.book._ks_id) {
        BooksService.update($scope.book._ks_id, $scope.book).then(onSuccessCb).catch(onErrorCb);
      } else {
        BooksService.create($scope.book).then(onSuccessCb).catch(onErrorCb);
      }
    }
  }
}
