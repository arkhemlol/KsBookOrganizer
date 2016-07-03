export class BookDirective implements ng.IDirective {
  public restrict: string = 'EA';
  public link: ng.IDirectiveLinkFn;
  public transclude: boolean = true;
  public scope: any  = {
    book: '='
  };

  public template: string = '<div class="book-list-item" ng-if="book"><div class="book-heading">{{book.header}}</div>' +
    '<div class="book-item-content"></div>' +
    '<div class="book-item-footer"></div></div>';

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
