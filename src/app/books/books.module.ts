import * as books from './books.entry';
import {name as coreName} from '../core/core.module';
export let name: string = 'KS.books';
'use strict';
angular.module('KS.books', ['angularFileUpload', 'LocalStorageModule', coreName])
  .decorator('FileSelect', ['$delegate', ($delegate: any) => {
    $delegate.prototype.onChange = function () {
      let files = this.uploader.isHTML5 ? this.element[0].files : this.element[0];
      let options = this.getOptions();
      let filters = this.getFilters();

      if (!this.uploader.isHTML5) this.destroy();
      if (this.uploader.queue.length && this.uploader.queueLimit === 1 && this.element[0].files.length) {
        this.uploader.clearQueue();
      }
      this.uploader.addToQueue(files, options, filters);
      if (this.isEmptyAfterSelection()) this.element.prop('value', null);
    };
    return $delegate;
  }])
  .provider('BooksService', books.BooksServiceProvider.Factory)
  .service('Books', books.BooksService)
  .controller('BooksController', books.BooksController)
  .controller('BooksDetailsController', books.BooksDetailsController)
  .directive('ksUpload', books.BookUploadDirective.Factory())
  .config((BooksServiceProvider: KS.core.ICRUDServiceProvider) => {
    BooksServiceProvider.url = 'books';
  })
  .run(books.booksRun);
