/**
* Stores various regexps for validation purposes.
* @class ValidationService
* @singleton
*/
export class ValidationService implements KS.core.IValidationService {
  number: RegExp = /^\d+$/;
  email: RegExp = /^[a-z\u0430-\u044F\u0401\u0451\u0410-\u042F0-9._%+-]+@[a-z\u0430-\u044F\u0401\u0451\u0410-\u042F0-9.-]+\.[a-z\u0430-\u044F\u0401\u0451\u0410-\u042F]{2,4}$/i;
  phone: RegExp = /^\+?\d\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/;
  phoneMTS: RegExp = /^\(?([0-9]{3})\)?([ .-]?)([0-9]{3})\2([0-9]{4})$/;
  name: RegExp = /^[A-Za-z\u0430-\u044F\u0401\u0451\u0410-\u042F]{0,15}$/i;
  lastName: RegExp = /^[A-Za-z\u0430-\u044F\u0401\u0451\u0410-\u042F]{0,18}$/;
  password: RegExp = /^.{1,18}$/;
  emptyField: RegExp = /.+/;
  /**
   * @public Stores some field value to compare with current
   */
  sameFieldVal: any;

  /**
   * Compare function for 'sameField' Validator
   * @param first
   * @param second
   * @returns {boolean}
   */
  sameField(first: any, second: any): boolean {
    return first === second;
  }

  /**
   * Initializes ngModel validators with the validator functions.
   * Uses regexps from ValidationService class public fields
   * If @prop sameField is present and a function, calls it with previously stored form field value
   * and modelValue from current form field
   * @param {String[]} regexps Regexps string tokens
   * @param modelCtrl
   * @param [addVal] Value to store for 'samefield' validator
   */
  initValidators(regexps: string[], modelCtrl: ng.INgModelController, addVal?: any): void {
    this.sameFieldVal = addVal;
    regexps.forEach((value: string) => {
      value = value.trim();
      let validatorFn = (ngModelValue: any) => {
        let regex = this[value];
        ngModelValue = angular.isUndefined(ngModelValue) ? '' : ngModelValue;
        if (typeof regex === 'function' && value === 'sameField' && ngModelValue) {
          return regex(ngModelValue, this.sameFieldVal);
        }
        return regex && regex instanceof RegExp && regex.test(ngModelValue);
      };
      modelCtrl.$validators[value + 'Validator'] = validatorFn.bind(this);
    }, this);
  }

  /**
   * Retrieves all reg-exp based validator names
   * @returns {string[]|boolean[]}
     */
  getNames(): string[] {
    return _.filter(_.map(this, (value: any, key: string) => {
      if (value instanceof RegExp) {
          return key;
      }
    }), angular.isString);
  }
}

/**
 * @class Validation Directive to validate form fields and show messages with ngMessages
 * @static Factory helper function which instantiates directive
 * @public unboundLink Directive link function
 */
export class Validation implements ng.IDirective {
  public restrict: string = 'A';
  public require: string = 'ngModel';
  public link: ng.IDirectiveLinkFn;
  public scope: any  = {
    val: '=validateAddField'
  };
  /**
   * Accepts comma-separated validator's names
   * Also accepts additional argument (validateAddField) for validation between two different form fields
   * Sets watcher for that field's value to track changes if 'sameField' validator was provided
   * If that value has been changed, invokes validation process
   * Applies custom validation modificator class to the element
   * @param scope
   * @param element
   * @param attrs
     * @param ctrl
   * */
  public unboundLink: ng.IDirectiveLinkFn = (scope: KS.core.IValidationDirectiveScope, element: JQuery, attrs: KS.auth.IValidationAttrs, ctrl: ng.INgModelController) => {
    let regexps = attrs.validation.length ? attrs.validation.split(',') : [];
    element.addClass('t-one-validation');
    this.$validate.initValidators(regexps, ctrl, scope.val);
    if (_.indexOf(regexps, 'sameField') >= 0) {
      scope.$watch(() => scope.val, (newValue: any) => {
        this.$validate.sameFieldVal = newValue;
        ctrl.$validate();
      });
    }
  };


  private $validate: KS.core.IValidationService;

  constructor(ValidationService: KS.core.IValidationService) {
    this.link = this.unboundLink.bind(this);
    this.$validate = ValidationService;
  }

  /**
   * Factory directive function
   * @returns {function(KS.core.IValidationService): Validation}
   * @constructor
     */
  public static Factory(): ng.IDirectiveFactory {
    const directive = (ValidationService: KS.core.IValidationService) => new Validation(ValidationService);
    directive.$inject = ['ValidationService'];
    return directive;
  }

}


