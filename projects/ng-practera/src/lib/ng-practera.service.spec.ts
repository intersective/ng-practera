import { TestBed, fakeAsync, async } from '@angular/core/testing';
import { of } from 'rxjs';
import { RequestService } from './services/request/request.service';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { BrowserStorageService } from './services/storage/storage.service';
import { UtilsService } from './services/utils/utils.service';

import { NgPracteraService } from './ng-practera.service';

describe('NgPracteraService', () => {
  let service: NgPracteraService;
  let requestSpy: jasmine.SpyObj<RequestService>;
  let routerSpy: jasmine.SpyObj<Router>;
  let storageSpy: jasmine.SpyObj<BrowserStorageService>;
  let utilsSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [
        NgPracteraService,
        {
          provide: RequestService,
          useValue: jasmine.createSpyObj('RequestService', ['delete', 'post', 'get', 'put', 'apiResponseFormatError'])
        },
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
    requestSpy = TestBed.inject(RequestService) as jasmine.SpyObj<RequestService>;
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

  it('when testing login(), it should pass the correct data to API', () => {
    requestSpy.post.and.returnValue(of(
      {
        apikey: 'demo-apikey',
        stacks: mockStacks
      }
    ));
    utilsSpy.has.and.returnValue(false);
    service.login({ username: 'test@test.com', password: '123' }).subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
    expect(requestSpy.post.calls.first().args[1]).toEqual({
      username: 'test@test.com', password: '123'
    });
    expect(storageSpy.setUser.calls.first().args[0]).toEqual({ apikey: 'demo-apikey' });
  });

  it('when testing login(), it should throw error if api key is missing', () => {
    requestSpy.post.and.returnValue(of({}));
    utilsSpy.has.and.returnValue(false);
    service.login({ username: 'test@test.com', password: '123' }).subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
    expect(requestSpy.post.calls.first().args[1]).toEqual({
      username: 'test@test.com', password: '123'
    });
    expect(requestSpy.apiResponseFormatError.calls.count()).toBe(1);
    expect(requestSpy.apiResponseFormatError.calls.first().args[0]).toEqual('login api missing apikey');
  });

  describe('when testing isAuthenticated()', () => {
    it('should return true', () => {
      storageSpy.get.and.returnValue(true);
      expect(service.isAuthenticated()).toBe(true);
    });
    it('should return false', () => {
      storageSpy.get.and.returnValue(false);
      expect(service.isAuthenticated()).toBe(false);
    });
  });

  it('when testing forgotPassword()', () => {
    requestSpy.post.and.returnValue(of(''));
    service.forgotPassword('test@test.com').subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
    expect(requestSpy.post.calls.first().args[1].email).toEqual('test@test.com');
  });

  it('when testing resetPassword()', () => {
    requestSpy.put.and.returnValue(of(''));
    service.resetPassword({}).subscribe();
    expect(requestSpy.put.calls.count()).toBe(1);
  });

  it('when testing mfaRegister()', () => {
    requestSpy.post.and.returnValue(of(''));
    utilsSpy.getApiKey.and.returnValue('abc');
    service.mfaRegister({
      countryCode: '+00',
      number: '000000000'
    }).subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
    expect(requestSpy.post.calls.first().args[1]).toEqual({
      countryCode: '+00',
      number: '000000000'
    });
  });

  it('when testing mfaVerify()', () => {
    requestSpy.post.and.returnValue(of(''));
    utilsSpy.getApiKey.and.returnValue('abc');
    service.mfaVerify('abcdef').subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
    expect(requestSpy.post.calls.first().args[1].code).toEqual('abcdef');
  });

  it('when testing mfaSMS()', () => {
    requestSpy.post.and.returnValue(of(''));
    utilsSpy.getApiKey.and.returnValue('abc');
    service.mfaSMS().subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
  });

  it('when testing switchStack()', () => {
    requestSpy.post.and.returnValue(of(''));
    service.switchStack('abc123').subscribe();
    expect(requestSpy.post.calls.count()).toBe(1);
    expect(requestSpy.post.calls.first().args[1].stackUuid).toEqual('abc123');
  });

  it('when testing getSingleStack()', () => {
    requestSpy.get.and.returnValue(of(''));
    service.getSingleStack('123xyz').subscribe();
    expect(requestSpy.get.calls.count()).toBe(1);
    expect(requestSpy.get.calls.first().args[1].params.uuid).toEqual('123xyz');
  });

  it('when testing getStacksByUser() it should call with apikey in header', () => {
    requestSpy.get.and.returnValue(of(mockStacks));
    service.getStacksByUser('abc').subscribe();
    expect(requestSpy.get.calls.count()).toBe(1);
    expect(requestSpy.get.calls.first().args[1].headers.apikey).toEqual('abc');
  });
  it('when testing getStacksByUser() it should store more than one stack', () => {
    requestSpy.get.and.returnValue(of(mockStacks));
    service.getStacksByUser('abc').subscribe();
    expect(requestSpy.get.calls.count()).toBe(1);
    expect(storageSpy.set.calls.first().args[1]).toEqual(mockStacks);
  });
  it('when testing getStacksByUser() it should get one stack and return it', () => {
    requestSpy.get.and.returnValue(of(mockStacks[0]));
    service.getStacksByUser('abc').subscribe();
    expect(requestSpy.get.calls.count()).toBe(1);
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
});
