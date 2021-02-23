import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';

import { NgPracteraService } from '../ng-practera.service';

import { MfaVerifyComponent } from './mfa-verify.component';

describe('MfaVerifyComponent', () => {
  let component: MfaVerifyComponent;
  let fixture: ComponentFixture<MfaVerifyComponent>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaVerifyComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {
          provide: NgPracteraService,
          useValue: jasmine.createSpyObj('NgPracteraService', ['mfaSMS', 'mfaVerify'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaVerifyComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initalize varibles when component init', () => {
    component.ngOnInit();
    expect(component.verifyCode).toEqual('');
    expect(component.isVerifying).toEqual(false);
  });

  describe('when testing sendSMS()', () => {
    it('should emit send SMS click call back if call API false', fakeAsync(() => {
      component.sendSMSClickCallBack = new EventEmitter<any>();
      component.callApi = false;
      spyOn(component.sendSMSClickCallBack, 'emit');
      component.sendSMS();
      expect(component.sendSMSClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

    it(`should emit error call back with 'Mobile number not registered' if API return 401 error response`, fakeAsync(() => {
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.mfaSMS.and.returnValue(throwError({
        status: 401
      }));
      component.sendSMS();
      tick();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'smsAPI',
          message: 'Mobile number not registered. Please register mobile numbert to send SMS.',
          error: {status: 401}
        }
      );
    }));

    it(`should emit error call back with 'Varification code send failed' if API return error response`, fakeAsync(() => {
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.mfaSMS.and.returnValue(throwError({}));
      component.sendSMS();
      tick();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'smsAPI',
          message: 'Varification code send failed, please try again.',
          error: {}
        }
      );
    }));

    it('should emit success call back after successfully send SMS', fakeAsync(() => {
      component.sendSMSSuccessCallBack = new EventEmitter<any>();
      component.callApi = true;
      spyOn(component.sendSMSSuccessCallBack, 'emit');
      serviceSpy.mfaSMS.and.returnValue(of({}));
      component.sendSMS();
      tick();
      expect(component.sendSMSSuccessCallBack.emit).toHaveBeenCalledWith({});
    }));
  });

  describe('when testing codeVerification()', () => {
    it('should emit send SMS click call back if call API false', fakeAsync(() => {
      component.verifyClickCallBack = new EventEmitter<any>();
      component.callApi = false;
      spyOn(component.verifyClickCallBack, 'emit');
      component.codeVerification();
      expect(component.verifyClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

    it(`should emit error call back with 'Verification code incorrect' if API return 401 error response`, fakeAsync(() => {
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.mfaVerify.and.returnValue(throwError({
        status: 401
      }));
      component.codeVerification();
      tick();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'verifyAPI',
          message: 'Verification code incorrect. Please check and enter again.',
          error: {status: 401}
        }
      );
    }));

    it(`should emit error call back with 'Code varification failed' if API return error response`, fakeAsync(() => {
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.mfaVerify.and.returnValue(throwError({}));
      component.codeVerification();
      tick();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'verifyAPI',
          message: 'Code varification failed, please try again.',
          error: {}
        }
      );
    }));

    it('should emit success call back after successfully verify code', fakeAsync(() => {
      component.verifySuccessCallBack = new EventEmitter<any>();
      component.callApi = true;
      spyOn(component.verifySuccessCallBack, 'emit');
      serviceSpy.mfaVerify.and.returnValue(of({}));
      component.codeVerification();
      tick();
      expect(component.verifySuccessCallBack.emit).toHaveBeenCalledWith({});
    }));
  });
});
