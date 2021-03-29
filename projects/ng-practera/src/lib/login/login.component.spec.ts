import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';
import { ReactiveFormsModule } from '@angular/forms';

import { UtilsService } from '../services/utils/utils.service';
import { NgPracteraService } from '../ng-practera.service';

import { LoginComponent } from './login.component';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let utilsSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ReactiveFormsModule],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {
          provide: NgPracteraService,
          useValue: jasmine.createSpyObj('NgPracteraService', ['login', 'getLibraryConfig'])
        },
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            events: of()
          }
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['isEmpty'])
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
    utilsSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('when testing login()', () => {
    it('should emit error call back if username is empty', () => {
      spyOn(component.errorCallBack, 'emit');
      utilsSpy.isEmpty.and.returnValue(true);
      component.loginForm.setValue({username: '', password: 'abc'});
      component.login();
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'empty',
          message: 'Your username or password is empty, please fill them in.'
        }
      );
    });

    it('should emit success call back after successfully login', fakeAsync(() => {
      component.successCallBack = new EventEmitter<any>();
      component.callApi = true;
      spyOn(component.successCallBack, 'emit');
      component.loginForm.setValue({username: 'test@test.com', password: 'abc'});
      serviceSpy.login.and.returnValue(of({}));
      component.login();
      tick();
      expect(component.successCallBack.emit).toHaveBeenCalledWith({});
      expect(component.isLoggingIn).toBe(false);
    }));

    it('should emit login click call back if call API false', fakeAsync(() => {
      component.loginClickCallBack = new EventEmitter<any>();
      component.callApi = false;
      spyOn(component.loginClickCallBack, 'emit');
      component.login();
      expect(component.loginClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

    it('should emit error call back if password compromised', fakeAsync(() => {
      component.callApi = true;
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.login.and.returnValue(throwError(
        {
          status: 400,
          error: {passwordCompromised: true}
        }
      ));
      component.login();
      tick();
      expect(component.isLoggingIn).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: `We’ve checked this password against a global database of insecure passwords and your password was on it. <br>
          Please try again. <br>
          You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`
        }
      );
    }));

    it('should emit error call back if username and password incorrect', fakeAsync(() => {
      component.callApi = true;
      spyOn(component.errorCallBack, 'emit');
      component.loginForm.setValue({username: 'test@test.com', password: 'abc'});
      serviceSpy.login.and.returnValue(throwError({
        status: 400
      }));
      component.login();
      tick();
      expect(component.isLoggingIn).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: 'Your username or password is incorrect, please try again.'
        }
      );
    }));

    it('should emit forgot password click call back if user click on forgot password', fakeAsync(() => {
      spyOn(component.forgotPasswordCallBack, 'emit');
      component.forgotPassowrdClick();
      expect(component.forgotPasswordCallBack.emit).toHaveBeenCalledWith(true);
    }));
  });
});
