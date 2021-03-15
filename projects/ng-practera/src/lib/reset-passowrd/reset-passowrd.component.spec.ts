import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { Location, LocationStrategy, PathLocationStrategy } from '@angular/common';
import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { of, throwError } from 'rxjs';
import { NgPracteraService } from '../ng-practera.service';
import { Router, ActivatedRoute, UrlSerializer } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';

import { ResetPassowrdComponent } from './reset-passowrd.component';

describe('ResetPassowrdComponent', () => {
  let component: ResetPassowrdComponent;
  let fixture: ComponentFixture<ResetPassowrdComponent>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ResetPassowrdComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        Location,
        {
          provide: LocationStrategy,
          useClass: PathLocationStrategy
        },
        UrlSerializer,
        {
          provide: NgPracteraService,
          useValue: jasmine.createSpyObj('NgPracteraService', ['verifyResetPassword', 'resetPassword'])
        }
      ],
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ResetPassowrdComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
    serviceSpy.resetPassword.and.returnValue(of({}));
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when testing resetPassword()', () => {

    it('should emit success callback if api call success', fakeAsync(() => {
      component.resetPasswordForm.setValue({password: 'aaa', confirmPassword: 'aaa'});
      component.successCallBack = new EventEmitter<any>();
      component.callApi = true;
      spyOn(component.successCallBack, 'emit');
      serviceSpy.resetPassword.and.returnValue(of({}));
      component.resetPassword();
      tick();
      expect(component.successCallBack.emit).toHaveBeenCalledWith({});
      expect(component.isResetting).toBe(false);
    }));

    it('should emit reset password call back if call API false', fakeAsync(() => {
      component.resetPasswordForm.setValue({password: 'aaa', confirmPassword: 'aaa'});
      component.resetClickCallBack = new EventEmitter<any>();
      component.callApi = false;
      spyOn(component.resetClickCallBack, 'emit');
      component.resetPassword();
      expect(component.resetClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

    it('should emit error call back if password compromised', fakeAsync(() => {
      component.resetPasswordForm.setValue({password: 'aaa', confirmPassword: 'aaa'});
      component.callApi = true;
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.resetPassword.and.returnValue(throwError(
        {
          status: 400,
          error: {passwordCompromised: true}
        }
      ));
      component.resetPassword();
      tick();
      expect(component.isResetting).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: `We’ve checked this password against a global database of insecure passwords and your password was on it. <br>
          Please try again. <br>
          You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`,
          error: {
            status: 400,
            error: {passwordCompromised: true}
          }
        }
      );
    }));

    it('should emit error call back if API call fail', () => {
      component.resetPasswordForm.setValue({password: 'aaa', confirmPassword: 'aaa'});
      component.callApi = true;
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.resetPassword.and.returnValue(throwError(''));
      component.resetPassword();
      expect(component.isResetting).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: `Error updating password.Try again`,
          error: ''
        }
      );
    });
  });

  it('should emit login click call back if user click on login', fakeAsync(() => {
    spyOn(component.loginClickCallBack, 'emit');
    component.loginClick();
    expect(component.loginClickCallBack.emit).toHaveBeenCalledWith(true);
  }));
});
