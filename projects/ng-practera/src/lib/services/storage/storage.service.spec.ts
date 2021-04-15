import { TestBed } from '@angular/core/testing';
import { BrowserStorageService, BROWSER_STORAGE } from './storage.service';

describe('StorageService', () => {
  let service: BrowserStorageService;
  let storage: any; // : BROWSER_STORAGE;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrowserStorageService,
        {
          provide: BROWSER_STORAGE,
          useValue: jasmine.createSpyObj([
            'getItem',
            'setItem',
            'removeItem',
            'clear'
          ])
        },
      ]
    });
    service = TestBed.inject(BrowserStorageService);
    storage = TestBed.inject(BROWSER_STORAGE);
  });

  it('should created', () => {
    expect(service).toBeTruthy();
  });

  describe('set()', () => {
    it('should set value into cache', () => {
      service.set('test', 'value');
      expect(storage.setItem).toHaveBeenCalled();
    });
  });

  describe('append()', () => {
    it('should append value into cached key', () => {
      const key = 'test';

      service.append(key, {text: 'value1'});

      expect(storage.getItem).toHaveBeenCalledWith(`ngPractera-${key}`);
      expect(storage.setItem).toHaveBeenCalledTimes(1);
    });
  });

  describe('clear()', () => {
    it('should clear cache', () => {
      service.clear();
      expect(storage.clear).toHaveBeenCalled();
    });
  });

  describe('getUser()', () => {
    it('should get user information ("me" item)', () => {
      service.getUser();
      expect(storage.getItem).toHaveBeenCalledWith('ngPractera-me');
    });
  });

  describe('setUser()', () => {
    it('should set user information to ("me" item)', () => {
      service.getUser = jasmine.createSpy('getUser').and.returnValue({});

      service.setUser({ apikey: 'tester' });
      expect(storage.setItem).toHaveBeenCalledWith('ngPractera-me', '{"apikey":"tester"}');
    });
  });

  describe('getConfig()', () => {
    it('should retrieve cached config', () => {
      service.getConfig();
      expect(storage.getItem).toHaveBeenCalledWith('ngPractera-config');
    });
  });

  describe('setConfig()', () => {
    it('should set configuration to ("config" item)', () => {
      service.getConfig = jasmine.createSpy('getConfig').and.returnValue({});

      service.setConfig({ logo: 'image' });
      expect(storage.setItem).toHaveBeenCalledWith('ngPractera-config', '{"logo":"image"}');
    });
  });

  describe('setCountry()', () => {
    it('should set setCountry to ("country" item)', () => {
      service.getConfig = jasmine.createSpy('country').and.returnValue({});

      service.setCountry('test');
      expect(storage.setItem).toHaveBeenCalledWith('ngPractera-country', '"test"');
    });
  });

  describe('getCountry()', () => {
    it('should retrieve cached country', () => {
      service.getCountry();
      expect(storage.getItem).toHaveBeenCalledWith('ngPractera-country');
    });
  });
});
