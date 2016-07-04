import * as books from './books.entry';
import {name as coreName} from '../core/core.module';
export let name: string = 'KS.books';
'use strict';
angular.module('KS.books', [coreName])
  .provider('BooksService', books.BooksServiceProvider.Factory)
  .service('Books', books.BooksService)
  .controller('BooksController', books.BooksController)
  .directive('book', books.BookDirective.Factory())
  .config((BooksServiceProvider: KS.core.ICRUDServiceProvider) => {
    BooksServiceProvider.url = 'books';
  })
  .run(books.booksRun);
