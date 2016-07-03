'use strict';

describe('Validation Service', () => {
  interface IExtendedScope extends ng.IScope {
    addField: string;
    userInput: string;
  }
  let $scope: IExtendedScope, ctrl: ng.INgModelController,
    compile: ng.ICompileService, elem: ng.IAugmentedJQuery, form: ng.IAugmentedJQuery, formSimple: ng.IAugmentedJQuery,
    valid: KS.core.IValidationService, $root: ng.IRootScopeService;

  beforeEach(angular.mock.module('KS.core', 'ui.router', 'ngCookies'));

  beforeEach(inject((_ValidationService_: KS.core.IValidationService) => {
    valid = _ValidationService_;
    spyOn(valid, 'initValidators').and.callThrough();
  }));

  afterEach(function () {
    angular.element(formSimple).remove();
    angular.element(form).remove();
  });

  describe('for sameField validator', () => {

    let compileDirectiveWithSameField = (first: any, second: any, _$rootScope_: ng.IRootScopeService) => {
      $root = _$rootScope_;
      $scope = <IExtendedScope>_$rootScope_.$new();
      $scope.addField = second;
      $scope.userInput = first;
      elem = angular.element('<input type="text" ng-model="userInput" name="value" validation="email,sameField" validate-add-field="addField"/>');
      form = angular.element('<form name="form"><div ng-messages="form.value.$error" ng-messages-multiple ng-show="form.value.$dirty">' +
        '<span class="emailError" ng-message="emailValidator">INVALID EMAIL</span><span class="sameFieldError" ng-message="sameFieldValidator">ANOTHER FIELD ERROR</span></div>' +
        '<input type="text" name="anotherField" ng-model="val"/></form>').append(elem);
      angular.element('body').append(form);
      compile(form)($root);
      compile(elem)($scope);
      $scope.$digest();
      return elem;
    };

    describe('with incorrect value', () => {

      beforeEach(inject((_$rootScope_: ng.IRootScopeService,
                         _$compile_: ng.ICompileService) => {
        compile = _$compile_;
        elem = compileDirectiveWithSameField('test@example.ru', 'example@example.ru', _$rootScope_);
      }));


      it('should show correct error message for wrong email', () => {
        expect(form.find('.emailError').text()).toEqual('INVALID EMAIL');
        expect(form.find('.emailError').css('display')).not.toEqual('none');
      });

      it('should show correct error message for wrong same field validator', () => {
        expect(form.find('.sameFieldError').text()).toEqual('ANOTHER FIELD ERROR');
        expect(form.find('.sameFieldError').css('display')).not.toEqual('none');
      });

      it('should store same field value in a validation service', () => {
        expect(valid.sameFieldVal).toEqual('example@example.ru');
      });

      it('should set invalid form for invalid sameField validator values', () => {
        expect($root.form.value.$error).toEqual({ sameFieldValidator: true});
      });


      it('directive element should have validation modificator class', () => {
        expect(elem.hasClass('t-one-validation')).toBeTruthy();
      });

      it('should contain a validation service', () => {
        expect(valid).not.toEqual(null);
      });

      it('should apply isolated scope value', () => {
        ctrl = elem.controller('ngModel');
        expect(ctrl.$modelValue).toEqual('test@example.ru');
      });

      it('should properly register validators', () => {
        expect($scope.userInput).toBeDefined();
        expect(valid.initValidators).toHaveBeenCalled();
      });

    });

    describe('with correct value', () => {
      beforeEach(inject((_$rootScope_: ng.IRootScopeService,
                         _$compile_: ng.ICompileService) => {
        compile = _$compile_;
        elem = compileDirectiveWithSameField('example@example.ru', 'example@example.ru', _$rootScope_);
      }));

      it('should set valid form for valid values', () => {
        expect($root.form.value.$error).toEqual({});
      });

    });
  });

  describe('for simple validators', () => {
    // dunno how to get it from service without running any test, running tests inside another test is prohibited
    let _valid: string[] = ['email', 'phone', 'phoneMTS', 'number', 'name', 'lastName'];
    let compileDirective = (first: any, _$rootScope_: ng.IRootScopeService, validator?: string) => {
      $root = _$rootScope_;
      $scope = <IExtendedScope>_$rootScope_.$new();
      $scope.userInput = first;
      elem = angular.element(`<input type="text" ng-model="userInput" name="value" validation="${validator}"/>`);
      formSimple = angular.element(`<form name="formSimple"><div ng-messages="formSimple.value.$error" ng-show="formSimple.value.$dirty">
        <span class="${validator}Error" ng-message="${validator}Validator">invalid ${validator}</span></div></form>`).append(elem);
      angular.element('body').append(formSimple);
      compile(formSimple)($root);
      compile(elem)($scope);
      $scope.$digest();
      return elem;
    };
    let invalidate = (value: string) => {
      _valid.forEach((validator: string) => {
          it(`for validator <${validator}> should make form invalid`, inject((_$rootScope_: ng.IRootScopeService,
                                     _$compile_: ng.ICompileService) => {
            compile = _$compile_;
            elem = compileDirective(value, _$rootScope_, validator);
            let obj = {};
            if (validator !== 'emptyField') {
              obj[validator + 'Validator'] = true;
            }
            expect($root.formSimple.value.$error).toEqual(obj);
          }));
      });
    };

    let validate = (value: string, validator: string) => {
      it(`for validator <${validator}> should make form error free`, inject((_$rootScope_: ng.IRootScopeService,
                                                                          _$compile_: ng.ICompileService) => {
        compile = _$compile_;
        elem = compileDirective(value, _$rootScope_, validator);
        expect($root.formSimple.value.$error).toEqual({});
      }));
    };

    describe('with incorrect value', () => {
      invalidate('sfddsfdsf32434dsfdsf');
    });

    describe('with correct value', () => {
      validate('Rererefg', 'name');
      validate('Rererefg', 'lastName');
      validate('+79031439630', 'phone');
      validate('9031439630', 'phoneMTS');
      validate('example@example.com', 'email');
      validate('$%^&@#$#$#$#^&&&', 'emptyField');
      validate('223432565656', 'number');
    });


  });

});

