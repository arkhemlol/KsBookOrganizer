///<reference path="../index.d.ts"/>

declare module KS.books {
  export interface IAuthor {
    id: string;
    name: string;
    lastName: string;
    books?: string[];
  }
  export interface IBook {
    id: string;
    header: string;
    authors: IAuthor[];
    pagesNumber: number,
    publisher?: string;
    publishYear: number;
    publishDate: Date;
    ISBN: string;
    img?: Blob;
  }
  export interface IBookService extends KS.core.ICRUDService<IBook> {}
}

// Отображать список книг со следующими параметрами:
//
//   - заголовок (обязательный параметр, не более 30 символов)
//
// - список авторов (книга должна содержать хотя бы одного автора)
//
// - имя автора (обязательный параметр, не более 20 символов)
//
// - фамилия автора (обязательный параметр, не более 20 символов)
//
// - количество страниц (обязательный параметр, больше 0 и не более 10000)
//
// - название издательства (опциональный параметр, не более 30 символов)
//
// - год публикации (не раньше 1800)
//
// - дата выхода в тираж (не раньше 01.01.1800)
//
// - ISBN с валидацией (http://en.wikipedia.org/wiki/International_Standard_Book_Number)
//
// - изображение (опциональный параметр)
