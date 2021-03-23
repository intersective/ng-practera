import { TestBed, fakeAsync, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserStorageService } from './services/storage/storage.service';
import { UtilsService } from './services/utils/utils.service';

import { NgPracteraService } from './ng-practera.service';

describe('NgPracteraService', () => {
  let service: NgPracteraService;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<BrowserStorageService>;
  let utilsSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        NgPracteraService,
        {
          provide: Router,
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            events: of()
          }
        },
        {
          provide: BrowserStorageService,
          useValue: jasmine.createSpyObj('BrowserStorageService', ['setUser', 'getUser', 'set', 'getConfig', 'setConfig', 'get', 'clear'])
        },
        {
          provide: UtilsService,
          useValue: jasmine.createSpyObj('UtilsService', ['utcToLocal', 'has', 'changeThemeColor', 'openUrl', 'getApiKey', 'setApiKey'])
        }
      ]
    });
    service = TestBed.inject(NgPracteraService);
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    storageSpy = TestBed.inject(BrowserStorageService) as jasmine.SpyObj<BrowserStorageService>;
    utilsSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  const mockStacks = [
    {
      name: 'stack1',
      description: 'des1',
      lastLogin: 1606303873447,
      image: 'https://practera.com/wp-content/themes/practera/images/logo.png',
      url: 'https://practera.com'
    },
    {
      name: 'stack2',
      description: 'des2',
      lastLogin: 1606303873447,
      image: 'https://practera.com/wp-content/themes/practera/images/logo.png',
      url: 'https://practera.com'
    },
    {
      name: 'stack3',
      description: 'des3',
      lastLogin: 1606303873447,
      image: 'https://practera.com/wp-content/themes/practera/images/logo.png',
      url: 'https://practera.com'
    }
  ];

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  xit('when testing login(), it should pass the correct data to API', () => {
    utilsSpy.has.and.returnValue(false);
    service.login({ username: 'test@test.com', password: '123' }).subscribe();
  });

  xit('when testing login(), it should throw error if api key is missing', () => {
    utilsSpy.has.and.returnValue(false);
    service.login({ username: 'test@test.com', password: '123' }).subscribe();
  });

  xdescribe('when testing isAuthenticated()', () => {
    it('should return true', () => {
      storageSpy.get.and.returnValue(true);
      expect(service.isAuthenticated()).toBe(true);
    });
    it('should return false', () => {
      storageSpy.get.and.returnValue(false);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  xit('when testing forgotPassword()', () => {
    service.forgotPassword('test@test.com').subscribe();
  });

  xit('when testing resetPassword()', () => {
    service.resetPassword({}).subscribe();
  });

  xit('when testing mfaRegister()', () => {
    utilsSpy.getApiKey.and.returnValue('abc');
    service.mfaRegister({
      countryCode: '+00',
      number: '000000000'
    }).subscribe();
  });

  xit('when testing mfaVerify()', () => {
    utilsSpy.getApiKey.and.returnValue('abc');
    service.mfaVerify('abcdef').subscribe();
  });

  xit('when testing mfaSMS()', () => {
    utilsSpy.getApiKey.and.returnValue('abc');
    service.mfaSMS().subscribe();
  });

  xit('when testing switchStack()', () => {
    service.switchStack('abc123').subscribe();
  });

  xit('when testing getSingleStack()', () => {
    service.getSingleStack('123xyz').subscribe();
  });

  xit('when testing getStacksByUser() it should call with apikey in header', () => {
    service.getStacksByUser('abc').subscribe();
  });
  xit('when testing getStacksByUser() it should store more than one stack', () => {
    service.getStacksByUser('abc').subscribe();
  });
  xit('when testing getStacksByUser() it should get one stack and return it', () => {
    service.getStacksByUser('abc').subscribe();
  });
  xit('when testing getStacks() it should return list of stack if no apikey', async () => {
    storageSpy.get.and.returnValue(mockStacks);
    // utilsSpy.utcToLocal.and.returnValue('');
    service.getStacks(undefined).subscribe(
      (result) => {
        expect(result.length).toEqual(3);
      }
    );
  });
  xit('when testing verifyRegistration() it should return registration link valid or not', () => {
    service.verifyRegistration({
      email: 'test@test.com',
      key: '12345'
    }).subscribe();
  });

  xit('when testing saveRegistration() it should register the new user', () => {
    service.saveRegistration({
      password: '1234',
      user_id: 123455,
      key: '12345'
    }).subscribe();
  });
});
