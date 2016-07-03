///<reference path="../index.d.ts"/>

declare module KS.mock {
  export interface IMockService {
    API: IAPI;
    run(): void;
    initAPI(): void;
  }

  export interface IAPI {
    getBooks?: () => ng.mock.IRequestHandler;
    getBook?: () => ng.mock.IRequestHandler;
    passAllGet?: () => ng.mock.IRequestHandler;
    passAllPost?: () => ng.mock.IRequestHandler;
    passAllHtml?: () => ng.mock.IRequestHandler;
  }
}

