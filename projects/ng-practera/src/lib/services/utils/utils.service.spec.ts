import { TestBed } from '@angular/core/testing';
import { UtilsService } from './utils.service';
import * as _ from 'lodash';
// import * as moment from 'moment';

describe('UtilsService', () => {
  // const NOW = new Date();
  // const YESTERDAY = new Date(moment(NOW).subtract(1, 'day').toString());
  // const TOMORROW = new Date(moment(NOW).add(1, 'day').toString());
  let service: UtilsService;
  let lodash: any;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UtilsService,
      ]
    });

    service = TestBed.inject(UtilsService);
    if (_) {
      lodash = _;
    } else {
      throw new Error('Lodash not available');
    }
  });

  it('should created', () => {
    expect(service).toBeTruthy();
  });

  describe('lodash extensions', () => {
    it('should extend each()', () => {
      spyOn(lodash, 'each');
      service.each([1, 2, 3], () => true);
      expect(_.each).toHaveBeenCalled();
    });

    it('should unset', () => {
      spyOn(lodash, 'unset');
      service.unset([1, 2, 3], () => true);
      expect(_.unset).toHaveBeenCalled();
    });

    it('should find', () => {
      spyOn(lodash, 'find');
      service.find([1, 2, 3], () => true);
      expect(_.find).toHaveBeenCalled();
    });

    it('should findIndex', () => {
      spyOn(lodash, 'findIndex');
      service.findIndex([1, 2, 3], () => true);
      expect(_.findIndex).toHaveBeenCalled();
    });

    it('should has', () => {
      spyOn(lodash, 'has');
      service.has([1, 2, 3], () => true);
      expect(_.has).toHaveBeenCalled();
    });

    it('should flatten', () => {
      spyOn(lodash, 'flatten');
      service.flatten([1, 2, 3]);
      expect(_.flatten).toHaveBeenCalled();
    });

    it('should indexOf', () => {
      spyOn(lodash, 'indexOf');
      service.indexOf([1, 2, 3], () => true);
      expect(_.indexOf).toHaveBeenCalled();
    });

    it('should remove', () => {
      spyOn(lodash, 'remove');
      service.remove([1, 2, 3], () => true);
      expect(_.remove).toHaveBeenCalled();
    });
  });

  describe('openUrl()', () => {
    it('should execute open link with Window.open()', () => {
      const url = 'test.com';

      spyOn(window, 'open');
      service.openUrl(url);

      expect(window.open).toHaveBeenCalledWith(url, '_self');
    });
  });

  // describe('utcToLocal()', () => {
  //   const DATE_STRING = '2020-01-01 00:00:00 GMT+0000'; // UTC 2020-01-01 00:00:00
  //   const DATE_WITH_CURRENT_TIMEZONE = new Date(DATE_STRING); // Date with current timezone (non UTC)

  //   it('should return empty string if no time provided', () => {
  //     const result = service.utcToLocal('');
  //     expect(result).toEqual('');
  //   });

  //   it('should turn UTC date into locale time', () => {
  //     const result = service.utcToLocal(DATE_STRING);
  //     const timezoneRemovedDate = service.utcToLocal(DATE_WITH_CURRENT_TIMEZONE);
  //     expect(result).toEqual(timezoneRemovedDate);
  //   });

  //   it('should display date only', () => {
  //     const result = service.utcToLocal(DATE_STRING, 'date');
  //     expect(result).toEqual('1 Jan 2020');
  //   });

  //   it('should display time only', () => {
  //     const result = service.utcToLocal(DATE_STRING, 'time');
  //     const timezoneRemovedTime = service.utcToLocal(DATE_WITH_CURRENT_TIMEZONE, 'time');
  //     expect(result).toEqual(timezoneRemovedTime);
  //   });
  // });

  // describe('dateFormatter()', () => {
  //   it('should standardize date format', () => {
  //     const result = service.dateFormatter(NOW);
  //     expect(result).toEqual('Today');
  //   });

  //   it('should standardize today date into "Tomorrow"', () => {
  //     const result = service.dateFormatter(TOMORROW);
  //     expect(result).toEqual('Tomorrow');
  //   });

  //   it('should standardize today date into "Yesterday"', () => {
  //     const result = service.dateFormatter(YESTERDAY);
  //     expect(result).toEqual('Yesterday');
  //   });

  //   it('should standardize today date into formatted date', () => {
  //     const future30days = new Date(moment('2020-01-01').add(30, 'days').toString());
  //     const result = service.dateFormatter(future30days);
  //     expect(result).toEqual('31 Jan 2020');
  //   });
  // });

  // describe('getEvent()', () => {
  //   it('should listen event rxjs subject', () => {
  //     // service['_eventsSubject']
  //     const TEST_RES = 'test-event';
  //     const TEST_RES2 = 'test-event2';
  //     let result;
  //     service.getEvent('test').subscribe(res => {
  //       result = res;
  //     });

  //     service.broadcastEvent('test', TEST_RES);
  //     expect(result).toEqual(TEST_RES);

  //     service.broadcastEvent('test', TEST_RES2);
  //     expect(result).toEqual(TEST_RES2);

  //     service.broadcastEvent('test2', 'nothing happen');
  //     expect(result).not.toEqual('nothing happen');
  //   });
  // });

  describe('isMobile()', () => {
    it('should return false when screensize > 576', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(577);
      const result = service.isMobile();
      expect(result).toBeFalsy();
    });

    it('should return false when screensize <= 576', () => {
      spyOnProperty(window, 'innerWidth').and.returnValue(576);
      const result = service.isMobile();
      expect(result).toBeTruthy();
    });
  });

  describe('isEmpty()', () => {
    it('should check if target parameter is empty (undefined, null, {}, \'\')', () => {
      expect(service.isEmpty('')).toBeTruthy();
      expect(service.isEmpty({})).toBeTruthy();
      expect(service.isEmpty(null)).toBeTruthy();
      expect(service.isEmpty(undefined)).toBeTruthy();
      expect(service.isEmpty(0)).toBeFalsy();
      expect(service.isEmpty(1)).toBeFalsy();
    });
  });

  describe('urlQueryToObject()', () => {
    it('should turn url query into programmatically useable object', () => {
      const result = service.urlQueryToObject('this=is&a=test&object=value');
      expect(result).toEqual(jasmine.objectContaining({this: 'is', a: 'test', object: 'value'}));
    });
  });

  describe('timeComparer()', () => {
    const earlier = new Date(Date.UTC(2020, 0));

    it('should return 0 when compared dates are on same date as today (now)', () => {
      const result = service.timeComparer(new Date(), {
        compareDate: true
      });
      expect(result).toEqual(0);
    });

    it('should return -1 when compare earlier than now date', () => {
      const result = service.timeComparer(earlier);
      expect(result).toEqual(-1);
    });

    it('should return 0 when compare with 1 same dates', () => {
      const date = new Date();
      const result = service.timeComparer(date, { comparedString: date});
      expect(result).toEqual(0);
    });

    it('should return 1 when compare with later with earlier date', () => {
      const now = new Date();
      const later = new Date(now.setFullYear(now.getFullYear() + 1));
      const result = service.timeComparer(later, { comparedString: earlier});
      expect(result).toEqual(1);
    });
  });

  const SAMPLE = [{id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}];
  describe('getNextArrayElement()', () => {
    it('should return next element of an Array', () => {
      const result = service.getNextArrayElement(SAMPLE, 2);
      expect(result).toEqual(jasmine.objectContaining({id: 3}));
    });
  });

  describe('checkOrderById()', () => {
    it('should return true if target id is last element of an Array', () => {
      const result = service.checkOrderById(SAMPLE, 6, { isLast: true });
      expect(result).toBeTruthy();
    });
  });

  describe('iso8601Formatter()', () => {
    const DATE_STRING = '2019-08-06 15:03:00 GMT+0000';
    it('should turn time into ISO 8601 standard', () => {
      const result = service.iso8601Formatter(new Date(DATE_STRING));
      expect(result).toEqual('2019-08-06T15:03:00.000Z'); // ISO 8601
      expect(result).not.toEqual('2019-08-06T15:03:00Z');
    });

    it('should format time string to ISO 8601 standard', () => {
      const result = service.iso8601Formatter(DATE_STRING);
      expect(result).toEqual('2019-08-06T15:03:00.000Z'); // ISO 8601
    });

    it('should turn "2010-01-01 00:00:00" into ISO8601', () => {
      const result = service.iso8601Formatter('2010-01-01 00:00:00');
      expect(result).toEqual('2010-01-01T00:00:00.000Z');
    });
  });

  describe('getHttpsUrl()', () => {
    const returnUrl = 'https://test.com';
    it(`should replace 'http' with 'https' if url contains 'http'`, () => {
      const url = 'http://test.com';
      const result = service.getHttpsUrl(url);
      expect(result).toEqual(returnUrl);
    });

    it(`should add 'https://' to url if url not contains 'http' or 'https'`, () => {
      const url = 'test.com';
      const result = service.getHttpsUrl(url);
      expect(result).toEqual(returnUrl);
    });

    it(`should return url as it is if url contains 'https'`, () => {
      const url = 'https://test.com';
      const result = service.getHttpsUrl(url);
      expect(result).toEqual(returnUrl);
    });
  });
});
