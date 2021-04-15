import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';

import { AuthComponent } from './auth.component';
import { BrowserStorageService } from '../services/storage/storage.service';
import { UtilsService } from '../services/utils/utils.service';
import { NotificationService } from '../services/notification/notification.service';

describe('AuthComponent', () => {
  let component: AuthComponent;
  let fixture: ComponentFixture<AuthComponent>;
  let storageSpy: jasmine.SpyObj<BrowserStorageService>;
  let utilsSpy: jasmine.SpyObj<UtilsService>;
  let notificationServiceSpy: jasmine.SpyObj<NotificationService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        UtilsService,
        {
          provide: BrowserStorageService,
          useValue: jasmine.createSpyObj('BrowserStorageService', ['set'])
        },
        {
          provide: NotificationService,
          useValue: jasmine.createSpyObj('BrowserStorageService', ['presentToast', 'alert', 'popUp'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AuthComponent);
    component = fixture.componentInstance;
    storageSpy = TestBed.inject(BrowserStorageService) as jasmine.SpyObj<BrowserStorageService>;
    utilsSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
    notificationServiceSpy = TestBed.inject(NotificationService) as jasmine.SpyObj<NotificationService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when testing backToLoginCallBack()', () => {
    it(`should show login page by makeing 'showLogin' true and others false`, () => {
      component.backToLoginCallBack({});
      expect(component.showLogin).toEqual(true);
      expect(component.showForgotPassword).toEqual(false);
      expect(component.showMFARegister).toEqual(false);
      expect(component.showMFAVerify).toEqual(false);
    });
  });

  describe('when testing forgotPasswordClickCallBack()', () => {
    it(`should show forgot password page by makeing 'showForgotPassword' true and others false`, () => {
      component.forgotPasswordClickCallBack({});
      expect(component.showLogin).toEqual(false);
      expect(component.showForgotPassword).toEqual(true);
      expect(component.showMFARegister).toEqual(false);
      expect(component.showMFAVerify).toEqual(false);
    });
  });

  describe('when testing mfaRegisterSuccessCallBack()', () => {
    it(`should show MFA verify page by makeing 'showMFAVerify' true and others false`, () => {
      component.mfaRegisterSuccessCallBack({});
      expect(component.showLogin).toEqual(false);
      expect(component.showForgotPassword).toEqual(false);
      expect(component.showMFARegister).toEqual(false);
      expect(component.showMFAVerify).toEqual(true);
    });
  });

  describe('when testing mfaVirifySuccessCallBack()', () => {
    it(`should emit success call back with verify response`, () => {
      spyOn(component.successCallBack, 'emit');
      component.mfaVirifySuccessCallBack({});
      expect(component.successCallBack.emit).toHaveBeenCalledWith({});
    });
  });

  describe('when testing forgotPasswordSuccessCallBack()', () => {
    it(`should navigate to login page after show popup`, () => {
      const forgotPassRes = {
        email: 'user@test.com'
      };
      component.forgotPasswordSuccessCallBack(forgotPassRes);
      expect(component.showLogin).toEqual(true);
      expect(notificationServiceSpy.popUp).toHaveBeenCalled();
      expect(notificationServiceSpy.popUp.calls.first().args[0]).toEqual('forgotPasswordConfirmation');
      expect(notificationServiceSpy.popUp.calls.first().args[1]).toEqual({
        email: forgotPassRes.email
      });
    });
  });

  describe('when testing sendSMSSuccessCallBack()', () => {
    it(`should call alert function to show alert`, () => {
      component.sendSMSSuccessCallBack({});
      expect(notificationServiceSpy.alert).toHaveBeenCalled();
    });
  });

  describe('when testing loginSuccessCallBack()', () => {
    it(`should emit successCallback if loginResponse didn't have 'mfaRegistered'`, () => {
      spyOn(component.successCallBack, 'emit');
      component.loginSuccessCallBack({
        apikey: 'abc'
      });
      expect(component.successCallBack.emit).toHaveBeenCalledWith({
        apikey: 'abc'
      });
    });

    it(`should console error if API key not in login response`, () => {
      spyOn(console, 'error');
      component.loginSuccessCallBack({});
      expect(console.error).toHaveBeenCalledWith(`API response format error.\n login api missing apikey`);
    });

    it(`should navigate to MFA verify page if 'mfaRegistered' is true`, () => {
      spyOn(utilsSpy, 'has').and.returnValue(true);
      spyOn(utilsSpy, 'setApiKey');
      component.loginSuccessCallBack({
        apikey: 'abc',
        mfaRegistered: true
      });
      expect(component.showMFAVerify).toEqual(true);
    });

    it(`should navigate to MFA register page if 'mfaRegistered' is false`, () => {
      spyOn(utilsSpy, 'has').and.returnValue(true);
      spyOn(utilsSpy, 'setApiKey');
      component.loginSuccessCallBack({
        apikey: 'abc',
        mfaRegistered: false
      });
      expect(component.showMFARegister).toEqual(true);
    });
  });

  describe('when testing errorHandleCallBack()', () => {
    it(`should call alert function is error type contains 'API'`, () => {
      component.errorHandleCallBack({
        type: 'API',
        message: 'error message'
      });
      expect(notificationServiceSpy.alert).toHaveBeenCalled();
      expect(notificationServiceSpy.alert.calls.first().args[0].message).toEqual('error message');
    });

    it(`should call presentToast function is error type not contains 'API'`, () => {
      component.errorHandleCallBack({
        type: 'empty',
        message: 'empty error message'
      });
      expect(notificationServiceSpy.presentToast).toHaveBeenCalled();
      expect(notificationServiceSpy.presentToast.calls.first().args[0]).toEqual('empty error message');
    });
  });
});
