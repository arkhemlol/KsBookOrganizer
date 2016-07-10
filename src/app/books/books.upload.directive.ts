/**
 * Created by arkhemlol on 10.07.2016.
 */

export class BookUploadDirective implements ng.IDirective {
  public restrict: string = 'A';
  public link: ng.IDirectiveLinkFn;

  public template: string = '<canvas />';

  private unboundLinkFn: ng.IDirectiveLinkFn = (scope: ng.IScope, element: ng.IAugmentedJQuery, attrs: ng.IAttributes) => {
    let canvas: ng.IAugmentedJQuery;
    let self = this;
    if (!BookUploadDirective.helper(this.$window).support) return;

    let params = scope.$eval(attrs.ksUpload);
    if (BookUploadDirective.helper(this.$window).isUrl(params.file)
      || BookUploadDirective.helper(this.$window).isDataUrl(params.file)) {
      canvas = element.find('canvas');
      return onLoadFile({target: {result: params.file }});
    }
    if (!BookUploadDirective.helper(this.$window).isFile(params.file)) return;
    if (!BookUploadDirective.helper(this.$window).isImage(params.file)) return;

    canvas = element.find('canvas');
    let reader = new FileReader();

    reader.onload = onLoadFile;
    reader.readAsDataURL(params.file);

    function onLoadFile(event) {
      let img = new Image();
      img.onload = onLoadImage;
      img.src = event.target.result;
      self.$rootScope.$emit('KS.imageUploaded', {file: event.target.result});
    }

    function onLoadImage() {
      let width = params.width || this.width / this.height * params.height;
      let height = params.height || this.height / this.width * params.width;
      canvas.attr({ width: width, height: height });
      canvas[0].getContext('2d').drawImage(this, 0, 0, width, height);
    }
  };

  constructor(public $window: ng.IWindowService, public $rootScope: ng.IRootScopeService) {
    this.link = this.unboundLinkFn.bind(this);
  }


  public static Factory(): ng.IDirectiveFactory {
    let directive = ($window: ng.IWindowService, $rootScope: ng.IRootScopeService) => new BookUploadDirective($window, $rootScope);
    directive.$inject = ['$window', '$rootScope'];
    return directive;
  }

  static helper($window: ng.IWindowService): {
    support: boolean;
    isUrl(url: string): boolean;
    isFile(item: any): boolean;
    isImage(file: File): boolean;
    isDataUrl(file: string): boolean;
  } {
    return {
      support: !!($window.FileReader && $window.CanvasRenderingContext2D),
      isUrl: function(url) {
        return _.isString(url) && /(https?:\/\/.*\.(?:png|jpg))/i.test(url);
      },
      isFile: function(item) {
        return angular.isObject(item) && item instanceof $window.File;
      },
      isImage: function(file) {
        var type =  '|' + file.type.slice(file.type.lastIndexOf('/') + 1) + '|';
        return '|jpg|png|jpeg|bmp|gif|'.indexOf(type) !== -1;
      },
      isDataUrl: function(file) {
        return /data:image\/(jpg|png|jpeg|bmp|gif);base64.*/.test(file);
      }
    };
  }
}
