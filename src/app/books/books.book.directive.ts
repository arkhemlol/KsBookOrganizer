export class BookDirective implements ng.IDirective {
  public restrict: string = 'EA';
  public replace: boolean = true;
  public link: ng.IDirectiveLinkFn;
  public transclude: boolean = true;
  public scope: any  = {
    book: '='
  };

  public templateUrl: string = 'app/books/books.listItem.html';

  private unboundLinkFn: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {

  };

  constructor() {
    this.link = this.unboundLinkFn.bind(this);
  }

  /**
   * Factory directive function
   * @returns {function(): BookDirective}
   * @constructor
   */
  public static Factory(): ng.IDirectiveFactory {
    return () => new BookDirective();
  }

}
