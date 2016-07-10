///<reference path="../index.d.ts"/>

declare module KS.books {
  export interface IAuthor {
    _ks_id?: string;
    name: string;
    lastName: string;
    books?: string[];
  }
  export interface IBook {
    _ks_id?: string;
    header: string;
    authors: IAuthor[];
    pagesNumber: number,
    publisher?: string;
    publishYear: number;
    publishDate: string | Date;
    ISBN: string;
    img?: Blob;
  }
  export interface IBooksResponse {
    count: number;
    next: boolean;
    previous: boolean;
    result: IBook[];
  }
  export interface IBookService extends KS.core.ICRUDService<IBooksResponse> {
    getBooks(): ng.IPromise<IBooksResponse>;
    getBook(id: string): ng.IPromise<IBook>;
  }
}
