import { async, ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { CUSTOM_ELEMENTS_SCHEMA, EventEmitter } from '@angular/core';
import { of, throwError } from 'rxjs';

import { UtilsService } from '../services/utils/utils.service';
import { NgPracteraService } from '../ng-practera.service';
import { MfaRegisterComponent } from './mfa-register.component';

describe('MfaRegisterComponent', () => {
  let component: MfaRegisterComponent;
  let fixture: ComponentFixture<MfaRegisterComponent>;
  let utilsSpy: jasmine.SpyObj<UtilsService>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaRegisterComponent ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ],
      providers: [
        {
          provide: NgPracteraService,
          useValue: jasmine.createSpyObj('NgPracteraService', ['mfaRegister', 'getLibraryConfig'])
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['find'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaRegisterComponent);
    component = fixture.componentInstance;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
    utilsSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  const mockContactNumberFormat = {
    masks: {
      AUS: {
        format: '+61',
        placeholder: '000 000 000',
        pattern: '^[0-9]{3}[\s\-]?[\0-9]{3}[\s\-]?[0-9]{3}$',
        numberLength: '11'
      },
      US: {
        format: '+1',
        placeholder: '000 000 0000',
        pattern: '^[0-9]{3}[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$',
        numberLength: '12'
      },
      NZ: {
        format: '+64',
        placeholder: '0000000000',
        pattern: '^[0-9]{9-10}$',
        numberLength: '12'
      },
      DE: {
        format: '+49',
        placeholder: '000 000 000',
        pattern: '^[0-9]{3}[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$',
        numberLength: '12'
      },
      UK: {
        format: '+44',
        placeholder: '00 0000 0000',
        pattern: '^[0-9]{2}[\s\-]?[\0-9]{4}[\s\-]?[0-9]{4}$',
        numberLength: '12'
      },
      default: {
        format: '',
        placeholder: 'Mobile number',
        pattern: '',
        numberLength: ''
      }
    },
    countryCodes: [
      {
        name: 'Select country',
        code: 'default'
      },
      {
        name: 'Australia',
        code: 'AUS'
      },
      {
        name: 'US/Canada',
        code: 'US'
      },
      {
        name: 'New Zealand',
        code: 'NZ'
      },
      {
        name: 'Germany',
        code: 'DE'
      },
      {
        name: 'United Kingdom',
        code: 'UK'
      }
    ]
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load default contact number format when init component', () => {
    component.countryModel = 'default';
    component.contactNumberFormat = mockContactNumberFormat;
    component.ngOnInit();
    expect(component.activeCountryModelInfo.countryCode).toEqual('');
    expect(component.activeCountryModelInfo.placeholder).toEqual('Mobile number');
    expect(component.activeCountryModelInfo.pattern).toEqual('');
    expect(component.activeCountryModelInfo.length).toEqual('');
  });

  it('should load change contact number format when change cuntry model', () => {
    const selectedCountry = 'AUS';
    component.contactNumberFormat = mockContactNumberFormat;
    component.countryModel = selectedCountry;
    component.updateCountry();
    expect(component.activeCountryModelInfo.countryCode).toEqual(mockContactNumberFormat.masks[selectedCountry].format);
    expect(component.activeCountryModelInfo.placeholder).toEqual(mockContactNumberFormat.masks[selectedCountry].placeholder);
    expect(component.activeCountryModelInfo.pattern).toEqual(mockContactNumberFormat.masks[selectedCountry].pattern);
    expect(component.activeCountryModelInfo.length).toEqual(mockContactNumberFormat.masks[selectedCountry].numberLength);
  });

  it('should add spaces to separate the contact numbers', () => {
    component.contactNumber = '0123456789';
    component.formatContactNumber();
    expect(component.contactNumber).toEqual('012 345 678 9');
  });

  describe('when testing isMaxLength()', () => {
    it('should return false if country model is DE', () => {
      component.countryModel = 'DE';
      const result = component.isMaxLength();
      expect(result).toBe(false);
    });
    it('should return false if contact number is under limit', () => {
      component.countryModel = 'AUS';
      component.contactNumber = '345 678 9';
      component.activeCountryModelInfo.length = '14';
      const result = component.isMaxLength();
      expect(result).toBe(false);
    });
    it('should return true if contact number is over the limit', () => {
      component.countryModel = 'AUS';
      component.contactNumber = '345 678 923 412 3';
      component.activeCountryModelInfo.length = '14';
      const result = component.isMaxLength();
      expect(result).toBe(true);
    });
  });

  it('should emit login click call back if user click on login', fakeAsync(() => {
    spyOn(component.loginClickCallBack, 'emit');
    component.loginClick();
    expect(component.loginClickCallBack.emit).toHaveBeenCalledWith(true);
  }));

  describe('when testing registerMFA()', () => {
    it('should emit success call back after successfully register MFA', fakeAsync(() => {
      component.successCallBack = new EventEmitter<any>();
      component.callApi = true;
      component.activeCountryModelInfo.countryCode = '+94';
      component.contactNumber = '034 034 24';
      spyOn(component.successCallBack, 'emit');
      serviceSpy.mfaRegister.and.returnValue(of({}));
      component.registerMFA();
      tick();
      expect(component.successCallBack.emit).toHaveBeenCalledWith({});
      expect(component.isRegistering).toBe(false);
    }));

    it('should emit register click call back if call API false', fakeAsync(() => {
      component.registerClickCallBack = new EventEmitter<any>();
      component.callApi = false;
      spyOn(component.registerClickCallBack, 'emit');
      component.registerMFA();
      expect(component.registerClickCallBack.emit).toHaveBeenCalledWith(true);
    }));

    it('should emit error call back if API return error', fakeAsync(() => {
      component.callApi = true;
      component.activeCountryModelInfo.countryCode = '+94';
      component.contactNumber = '034 034 24';
      spyOn(component.errorCallBack, 'emit');
      serviceSpy.mfaRegister.and.returnValue(throwError({}));
      component.registerMFA();
      tick();
      expect(component.isRegistering).toBe(false);
      expect(component.errorCallBack.emit).toHaveBeenCalledWith(
        {
          type: 'API',
          message: 'Mobile number registration failed, please try again.',
          error: {}
        }
      );
    }));
  });
});
