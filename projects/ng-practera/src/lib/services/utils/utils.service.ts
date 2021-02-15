import { Injectable, Inject } from '@angular/core';
import * as _ from 'lodash';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';
import { map, filter } from 'rxjs/operators';
// import * as moment from 'moment';

// enhance Window reference later, we shouldn't refer directly to browser's window object like this
declare var window: any;

@Injectable({
  providedIn: 'root'
})
export class UtilsService {
  private readonly lodash: any;
  // this Subject is used to broadcast an event to the app
  protected eventsSubject = new Subject<{key: string, value: any}>();
  // -- Not in used anymore, leave them commented in case we need later --
  // // this Subject is used in project.service to cache the project data
  // public projectSubject = new BehaviorSubject(null);
  // // this Subject is used in activity.service to cache the activity data
  // // it stores key => Subject pairs of all activities
  // public activitySubjects = {};
  // Use to store apikey while user finish MFA actions.
  private apikey = '';

  constructor(
    @Inject(DOCUMENT) private readonly document: Document,
  ) {
    if (_) {
      this.lodash = _;
    } else {
      throw new Error('Lodash not available');
    }
  }

  setApiKey(key: any): void {
    this.apikey = key;
  }

  getApiKey(): any {
    return this.apikey;
  }

  /**
   * isMobile - checking device is a mobile or not
   * @description grouping device type into 2 group (mobile/desktop) and return true if mobile, otherwise return false
   * @example https://github.com/ionic-team/ionic/blob/master/angular/src/providers/platform.ts#L71-L115
   */
  isMobile(): any {
    return window.innerWidth <= 576;
  }

  /** check if a value is empty
   * precautions:
   *  - Lodash's isEmpty, by default, sees "number" type value as empty,
   *    but in our case, we just treat null/undefined/""/[]/{} as empty.
   *  - [{}] = true
   *  - [{}, {}, {}] = false
   *
   * @param  any     value
   * @return boolean   true: when empty string/object/array, otherwise false
   */
  isEmpty(value: any): boolean {
    // number type value shouldn't be treat as empty
    if (typeof value === 'number') {
      return false;
    }

    return this.lodash.isEmpty(value);
  }

  each(collections: any[], callback: any): any {
    return this.lodash.each(collections, callback);
  }

  unset(object: any, path: any): any {
    return this.lodash.unset(object, path);
  }

  find(collections: any[], callback: any): any {
    return this.lodash.find(collections, callback);
  }

  findIndex(collections: any[], callback: any): any {
    return this.lodash.findIndex(collections, callback);
  }

  has(object: any, path: any): any {
    return this.lodash.has(object, path);
  }

  flatten(array: any[]): any {
    return this.lodash.flatten(array);
  }

  indexOf(array: any[], value: any, fromIndex= 0): any {
    return this.lodash.indexOf(array, value, fromIndex);
  }

  remove(collections: any[], callback: any): any {
    return this.lodash.remove(collections, callback);
  }

  openUrl(url: string, options?: { target: string }): any {
    options = options || {target: '_self' };
    return window.open(url, options.target);
  }

  changeThemeColor(color: string): void {
    this.document.documentElement.style.setProperty('--ion-color-primary', color);
    this.document.documentElement.style.setProperty('--ion-color-primary-shade', color);
    // get the tint version of the color(20% opacity)
    this.document.documentElement.style.setProperty('--ion-color-primary-tint', color + '33');
    // convert hex color to rgb and update css variable
    const hex = color.replace('#', '');
    const red = parseInt(hex.substring(0, 2), 16);
    const green = parseInt(hex.substring(2, 4), 16);
    const blue = parseInt(hex.substring(4, 6), 16);

    this.document.documentElement.style.setProperty('--ion-color-primary-rgb', `${red},${green},${blue}`);
  }

  changeCardBackgroundImage(image: string): void {
    this.document.documentElement.style.setProperty('--practera-card-background-image', `url(\'${image}\')`);
  }

  // broadcast the event to whoever subscribed
  broadcastEvent(key: string, value: any): void {
    this.eventsSubject.next({ key, value });
  }

  // get Event to subscribe to
  getEvent(key: string): Observable<any> {
    return this.eventsSubject.asObservable()
      .pipe(
        filter(e => e.key === key),
        map(e => e.value)
      );
  }

  // transfer url query string to an object
  urlQueryToObject(query: string): any {
    return JSON.parse(`{"${decodeURI(query).replace(/"/g, '\\"').replace(/&/g, '","').replace(/=/g, '":"')}"}`);
  }

  /**
   * turn date into customised & human-readable language (non RFC2822/ISO standard)
   * @param Date | string time Date
   * @param string display date: display date, time: display time, all: date + time
   */
  // utcToLocal(time: Date | string , display = 'all'): any {
  //   if (!time) {
  //     return '';
  //   }
  //   const date = new Date(this.iso8601Formatter(time));
  //   const formattedTime = new Intl.DateTimeFormat('en-US', {
  //     hour12: true,
  //     hour: 'numeric',
  //     minute: 'numeric'
  //   }).format(date);

  //   switch (display) {
  //     case 'date':
  //       return this.dateFormatter(date);

  //     case 'time':
  //       return formattedTime;

  //     default:
  //     return `${this.dateFormatter(date)} ${formattedTime}`;
  //   }
  // }

  /**
   * @description turn date into string formatted date
   * @param Date date targetted date
   */
  // dateFormatter(date: Date): string {
  //   const dateToFormat = moment(date);
  //   const today = moment(new Date());
  //   const tomorrow = today.clone().add(1, 'day').startOf('day');
  //   const yesterday = today.clone().subtract(1, 'day').startOf('day');

  //   if (dateToFormat.isSame(yesterday, 'd')) {
  //     return 'Yesterday';
  //   }
  //   if (dateToFormat.isSame(tomorrow, 'd')) {
  //     return 'Tomorrow';
  //   }
  //   if (dateToFormat.isSame(today, 'd')) {
  //     return 'Today';
  //   }

  //   return new Intl.DateTimeFormat('en-GB', {
  //     month: 'short',
  //     day: 'numeric',
  //     year: 'numeric'
  //   }).format(dateToFormat.toDate());
  // }

  /**
   * @description dates comparison (between today/provided date)
   * @param Date | string timeString [description]
   * @param boolean            = {}} options [description]
   * @return number -1: before, 0: same date, 1: after
   */
  timeComparer(
    timeString: Date | string,
    options: {
      comparedString?: Date | string,
      compareDate?: boolean
    } = {}
  ): number {
    const { comparedString, compareDate } = options;

    const time = new Date(this.iso8601Formatter(timeString));
    let compared = new Date();
    if (comparedString) {
      compared = new Date(this.iso8601Formatter(comparedString));
    }
    if (compareDate && (time.getDate() === compared.getDate() &&
    time.getMonth() === compared.getMonth() &&
    time.getFullYear() === compared.getFullYear())) {
      return 0;
    }
    if (time.getTime() < compared.getTime()) {
      return -1;
    }
    if (time.getTime() === compared.getTime()) {
      return 0;
    }
    if (time.getTime() > compared.getTime()) {
      return 1;
    }
    return 0;
  }

  /**
   * get next element in an array,
   * return undefined if the next value is not available
   */
  getNextArrayElement(target: any[], currentId: number): any {
    const index = target.findIndex(datum => {
      return datum.id === currentId;
    });

    return target[index + 1];
  }

  /**
   * check if the targeted element in an array is located at the last in the last index
   */
  checkOrderById(target: any[], currentId: any, options: {
    isLast: boolean;
  }): boolean {
    const length = target.length;
    const index = target.findIndex(datum => {
      return datum.id === currentId;
    });

    return (length - 1) === index;
  }
  /**
   * Format the time string
   * 1. Add 'T' between date and time, for compatibility with Safari
   * 2. Add 'Z' at last to indicate that it is UTC time, browser will automatically convert the time to local time
   *
   * Example time string: '2019-08-06 15:03:00'
   * After formatter: '2019-08-06T15:03:00Z'
   *
   * SAFARI enforce ISO 8601 (no space as time delimiter allowed)
   * T for time delimiter
   * Z for timezone (UTC) delimiter (+0000)
   */
  iso8601Formatter(time: Date | string): any {
    try {
      if (typeof time === 'string') {
        let tmpTime = time;
        if (!time.includes('GMT') && !(time.toLowerCase()).includes('z')) {
          tmpTime += ' GMT+0000';
        }
        return (new Date(tmpTime)).toISOString();
      }
      return time.toISOString();
    } catch (err) {
      // in case the above doesn't work on Safari
      if (typeof time === 'string') {
        // add "T" between date and time, so that it works on Safari
        time = time.replace(' ', 'T');
        // add "Z" to indicate that it is UTC time, it will automatically convert to local time
        return time + 'Z';
      }
      return time.toISOString();
    }
  }

  getHttpsUrl(url: string): any {
    if (url.includes('https://')) {
      return url;
    }
    if (url.includes('http://')) {
      return url.replace('http', 'https');
    }
    if (!url.includes('https://') || !url.includes('http://')) {
      return `https://${url}`;
    }
    return url;
  }

}
