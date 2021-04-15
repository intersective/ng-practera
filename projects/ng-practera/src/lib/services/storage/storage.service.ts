import { Inject, Injectable, InjectionToken } from '@angular/core';

export const BROWSER_STORAGE = new InjectionToken<Storage>('Browser Storage', {
  providedIn: 'root',
  factory: () => localStorage
});

export interface User {
  apikey?: string;
}

export interface Config {
  logo?: string;
  color?: string;
}

@Injectable({
  providedIn: 'root'
})

export class BrowserStorageService {
  public memoryCache: any;
  private readonly keyPrefix = 'ngPractera';

  constructor(@Inject(BROWSER_STORAGE) public storage: Storage) {}

  get(key: string): any {
    key = `${this.keyPrefix}-${key}`;
    const cached = this.storage.getItem(key);
    if (cached) {
      return JSON.parse(this.storage.getItem(key) || '');
    }
    return null;
  }

  set(key: string, value: any): void {
    key = `${this.keyPrefix}-${key}`;
    return this.storage.setItem(key, JSON.stringify(value));
  }

  append(key: string, value: any): void {
    let actual = this.get(key);
    if (!actual) {
      actual = {};
    }
    return this.set(key, Object.assign(actual, value));
  }

  remove(key: string): void {
    key = `${this.keyPrefix}-${key}`;
    this.storage.removeItem(key);
  }

  clear(): void {
    this.storage.clear();
  }

  getUser(): any {
    return this.get(`me`) || {};
  }

  setUser(user: User): boolean {
    this.set(`me`, Object.assign(this.getUser(), user));
    return true;
  }

  getConfig(): any {
    return this.get(`config`) || {};
  }

  setConfig(config: Config): boolean {
    this.set(`config`, Object.assign(this.getConfig(), config));
    return true;
  }

  setCountry(country: string): void {
    this.set(`country`, country);
  }

  getCountry(): any {
    return this.get(`country`);
  }
}
