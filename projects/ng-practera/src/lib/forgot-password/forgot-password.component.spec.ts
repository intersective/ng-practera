import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of, throwError } from 'rxjs';

import { ForgotPasswordComponent } from './forgot-password.component';
import { UtilsService } from '../services/utils/utils.service';
import { NgPracteraService } from '../ng-practera.service';

describe('ForgotPasswordComponent', () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;
  let utils: UtilsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [ ForgotPasswordComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        UtilsService,
        {
          provide: NgPracteraService,
          useValue: jasmine.createSpyObj('NgPracteraService', ['forgotPassword', 'getLibraryConfig'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
    utils = TestBed.inject(UtilsService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
    expect(component.callApi).toEqual(true);
  });

  describe('when testing getConfig()', () => {
    it(`callApi should be false if service return false`, () => {
      serviceSpy.getLibraryConfig.and.returnValue({
        callApi: false,
        env: 'local'
      });
      component.getConfig();
      expect(component.callApi).toEqual(false);
    });
  });

  describe('ForgotPasswordComponent', () => {

    beforeEach(() => {
      component.email = 'test@test.com';
    });

    it('should emit error call back if email is empty', fakeAsync(() => {
      spyOn(component.errorCallBack, 'emit');
      component.email = '';
      component.send();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'empty',
          message: 'Please enter email.'
        }
      );
    }));

    it('should emit success call back if api call success', fakeAsync(() => {
      component.successCallBack = new EventEmitter<any>();
      component.callApi = true;
      spyOn(component.successCallBack, 'emit');
      serviceSpy.forgotPassword.and.returnValue(of({}));
      component.send();
      tick();
      expect(component.successCallBack.emit).toHaveBeenCalledWith({email: component.email});
      expect(component.isSending).toBe(false);
    }));

    it('should emit send email call back if call API false', fakeAsync(() => {
      component.sendEmailClickCallBack = new EventEmitter<any>();
      component.callApi = false;
      spyOn(component.sendEmailClickCallBack, 'emit');
      component.send();
      expect(component.sendEmailClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

    it('should emit error call back if password reset too frequently', fakeAsync(() => {
      component.callApi = true;
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.forgotPassword.and.returnValue(throwError({
        error: {
          type: 'reset_too_frequently'
        }
      }));
      component.send();
      tick();
      expect(component.isSending).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: 'Please wait 2 minutes before attempting to reset your password again'
        }
      );
    }));

    it('should emit error call back if forgot password failed', fakeAsync(() => {
      component.callApi = true;
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.forgotPassword.and.returnValue(throwError({}));
      component.send();
      tick();
      expect(component.isSending).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: 'Issue occured. Please try again'
        }
      );
    }));

    it('should emit login click call back if user click on login', fakeAsync(() => {
      spyOn(component.loginClickCallBack, 'emit');
      component.loginClick();
      expect(component.loginClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

  });
});
