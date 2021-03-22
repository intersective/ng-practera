import { ComponentFixture, TestBed, tick, fakeAsync } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import {
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { NgPracteraService } from '../ng-practera.service';
import { UtilsService } from '../services/utils/utils.service';

import { RegisterComponent } from './register.component';
import { TermsConditionsPreviewComponent } from '../terms-conditions-preview/terms-conditions-preview.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let ModalControllerSpy: jasmine.SpyObj<ModalController>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;
  let utilSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      declarations: [ RegisterComponent ],
      providers: [
        UtilsService,
        {
          provide: ModalController,
          useValue: jasmine.createSpyObj('ModalController', ['create'])
        },
        {
          provide: NgPracteraService,
          useValue: jasmine.createSpyObj('NgPracteraService', ['verifyRegistration', 'checkDomain', 'saveRegistration', 'login'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    ModalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
    utilSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it(`should not call api calls if 'callApi' is false `, () => {
    component.callApi = false;
    serviceSpy.verifyRegistration.and.returnValue(of({}));
    serviceSpy.checkDomain.and.returnValue(of({}));
    component.ngOnInit();
    expect(serviceSpy.verifyRegistration).not.toHaveBeenCalled();
    expect(serviceSpy.checkDomain).not.toHaveBeenCalled();
  });

  describe('when testing verifyRegistrationLink()', () => {
    it(`should call APIs and emit the call back if all data passed`, () => {
      component.userPrams = {
        email: 'abc@123.com',
        key: '123456'
      };
      component.domain = 'dev.asdf.com';
      component.verifySuccessCallBack = new EventEmitter<any>();
      spyOn(component.verifySuccessCallBack, 'emit');
      serviceSpy.verifyRegistration.and.returnValue(of({
        data: {
          User: {
            id: 1234
          }
        }
      }));
      serviceSpy.checkDomain.and.returnValue(of({
        data: {}
      }));
      component.callApi = true;
      component.ngOnInit();
      expect(serviceSpy.verifyRegistration).toHaveBeenCalledWith({
        email: 'abc@123.com',
        key: '123456'
      });
      expect(serviceSpy.checkDomain).toHaveBeenCalledWith({
        domain: 'dev.asdf.com'
      });
      expect(component.verifySuccessCallBack.emit).toHaveBeenCalledWith({
        userData: {
          email: 'abc@123.com',
          key: '123456',
          contact: null,
          id: 1234
        },
        configData: {}
      });
    });

    it(`should emit the error call back if userPrams empty`, () => {
      component.userPrams = {
        email: null,
        key: null
      };
      spyOn(component.errorCallBack, 'emit');
      component.callApi = true;
      component.ngOnInit();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith({
        type: 'verifyEmpty',
        message: 'Registration link invalid!',
        error: {error: 'Email or Key empty'}
      });
    });

    it(`should emit the error call back if Verify API fail`, () => {
      component.userPrams = {
        email: 'abc@123.com',
        key: '123456'
      };
      component.domain = 'dev.asdf.com';
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.verifyRegistration.and.returnValue(throwError({}));
      component.callApi = true;
      component.ngOnInit();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith({
        type: 'verifyAPI',
        message: 'Registration link invalid!',
        error: {}
      });
    });

    it(`should emit the error call back if check domain API fail`, () => {
      component.userPrams = {
        email: 'abc@123.com',
        key: '123456'
      };
      component.domain = 'dev.asdf.com';
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.verifyRegistration.and.returnValue(of({
        data: {
          User: {
            id: 1234
          }
        }
      }));
      serviceSpy.checkDomain.and.returnValue(throwError({}));
      component.callApi = true;
      component.ngOnInit();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith({
        type: 'verifyAPI',
        message: 'Registration link invalid!',
        error: {}
      });
    });
  });

  describe('when testing openLink()', () => {
    it(`should call open to show terms and conditions`, () => {
      spyOn(window, 'open');
      component.openLink();
      expect(window.open).toHaveBeenCalled();
    });
  });

  describe('when testing register()', () => {
    it(`should emit register click call back if callApi is false`, () => {
      component.callApi = false;
      component.registerClickCallBack = new EventEmitter<any>();
      spyOn(component.registerClickCallBack, 'emit');
      component.register();
      expect(component.registerClickCallBack.emit).toHaveBeenCalledWith(true);
    });

    it(`should emit register success call back if API return success response`, () => {
      component.registerSuccessCallBack = new EventEmitter<any>();
      spyOn(component.registerSuccessCallBack, 'emit');
      component.registerationForm.setValue({email: 'acb@asd.com', password: 'abcdefghijk', confirmPassword: 'abcdefghijk'});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'abcdefghijk';
      component.user.email = 'acb@asd.com';
      component.isAgreed = true;
      serviceSpy.saveRegistration.and.returnValue(of({}));
      serviceSpy.login.and.returnValue(of({}));
      component.register();
      expect(component.registerSuccessCallBack.emit).toHaveBeenCalledWith({
        registrationResponse: {},
        loginResponse: {}
      });
    });

    it(`should have errors if passowrds didn't matched`, () => {
      component.registerationForm.setValue({email: 'acb@asd.com', password: 'abcdefghijk', confirmPassword: 'abcdewsdfghijk'});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'abcdewsdfghijk';
      component.user.email = 'acb@asd.com';
      component.isAgreed = true;
      component.register();
      expect(component.errors[0]).toBe('Your passwords don\'t match.');
    });

    it(`should have errors if didn't agreed to the terms`, () => {
      component.registerationForm.setValue({email: 'acb@asd.com', password: 'abcdefghijk', confirmPassword: 'abcdefghijk'});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'abcdefghijk';
      component.user.email = 'acb@asd.com';
      component.register();
      expect(component.errors[0]).toBe('You need to agree with terms and Conditions.');
    });

    it(`should have errors if not passowrd provided`, () => {
      component.registerationForm.setValue({email: 'acb@asd.com', password: '', confirmPassword: ''});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'abcdefghijk';
      component.user.email = 'acb@asd.com';
      component.isAgreed = true;
      component.register();
      expect(component.errors[0]).toBe('Please fill in your password');
    });

    it(`should have errors if passowrd not more than 8 characters`, () => {
      component.registerationForm.setValue({email: 'acb@asd.com', password: 'asdf', confirmPassword: 'asdf'});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'asdf';
      component.user.email = 'acb@asd.com';
      component.isAgreed = true;
      component.register();
      expect(component.errors[0]).toBe('Your password needs to be more than 8 characters.');
    });

    it(`should emit error call back if login API fail`, () => {
      spyOn(component.errorCallBack, 'emit');
      component.registerationForm.setValue({email: 'acb@asd.com', password: 'abcdefghijk', confirmPassword: 'abcdefghijk'});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'abcdefghijk';
      component.user.email = 'acb@asd.com';
      component.isAgreed = true;
      serviceSpy.saveRegistration.and.returnValue(of({}));
      serviceSpy.login.and.returnValue(throwError({}));
      component.register();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith({
        type: 'registerAPI',
        message: 'Registration not complete!',
        error: {}
      });
    });

    it(`should emit error call back if register API fail`, () => {
      spyOn(component.errorCallBack, 'emit');
      component.registerationForm.setValue({email: 'acb@asd.com', password: 'abcdefghijk', confirmPassword: 'abcdefghijk'});
      component.user.id = 1234;
      component.user.key = 'qwerty';
      component.confirmPassword = 'abcdefghijk';
      component.user.email = 'acb@asd.com';
      component.isAgreed = true;
      serviceSpy.saveRegistration.and.returnValue(throwError({}));
      serviceSpy.login.and.returnValue(throwError({}));
      component.register();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith({
        type: 'registerAPI',
        message: 'Registration not complete!',
        error: {}
      });
    });
  });

  describe('when testing termsAndConditionsPopup()', () => {
    it(`should create a modal`, () => {
      component.termsAndConditionsPopup();
      expect(ModalControllerSpy.create.calls.count()).toBe(1);
    });
  });

});
