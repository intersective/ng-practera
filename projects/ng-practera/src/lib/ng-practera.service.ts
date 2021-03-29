import { Injectable, Inject, InjectionToken } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BrowserStorageService } from './services/storage/storage.service';

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

export interface LibConfig {
  env: string;
  callApi: boolean;
}

export interface StackObject {
  uuid: string;
  name: string;
  description: string;
  image: string;
  url: string;
  lastLogin: any;
}

interface VerifyParams {
  email: string;
  key: string;
}

interface RegisterData {
  password: string;
  user_id: number;
  key: string;
}

interface ConfigParams {
  domain?: string;
  id?: number | string;
  apikey?: string;
  appkey?: string;
}

interface UserProfile {
  contactNumber: string;
}

interface MFARigisterParams {
  countryCode: string;
  number: string;
}

interface ExperienceConfig {
  name: string;
  config?: {
    theme_color?: string;
    card_style?: string;
    review_rating?: boolean;
    review_rating_notification?: boolean;
    deep_link_in_app?: boolean;
    achievement_in_app_mentor?: boolean;
    achievement_in_app_participant?: boolean;
  };
  logo: string;
}

@Injectable({
  providedIn: 'root'
})
export class NgPracteraService {

  constructor(
    private readonly storage: BrowserStorageService,
    @Inject(LibConfigService) private config: LibConfig
  ) { }

  /**
   * Method will return library config set when library import to an app from module.
   * @returns Object - LibConfig Object
   */
  getLibraryConfig(): LibConfig {
    return this.config;
  }

  /**
   * login
   * @description login API - call to login user by passing username and password.
   * @param object email , password in string for each of the value
   */
  login({ username, password }: any): Observable<any> {
    const body = {
      username,
      password
    };
    return of({});
  }

  /**
   * directLogin
   * @description login API - call to login user by apikey in header.
   * @param apikey string - apikey getting from direct llink url
   */
  directLogin(apikey: string): Observable<any> {
    return of({});
  }

  isAuthenticated(): boolean {
    return this.storage.get('isLoggedIn');
  }

  /**
   * forgotPassword
   * @description make request to server to send out email with reset password url
   * @param  string  email [user's email which will receive reset password url]
   * @return Observable<any>  [description]
   */
  forgotPassword(email: string): Observable<any>  {
    const body = {
      email,
      resetLink: this._createResetDirectLinks(),
      directLink: this._createResetDirectLinks('direct')
    };
    return of({});
  }

  private _createResetDirectLinks(type?: string): string {
    switch (type) {
      case 'reset':
        // return `${environment.globalLoginUrl}?action=resetpassword&apiKey=`;
      case 'direct':
        // return `${environment.globalLoginUrl}?action=direct&apiKey=`;
      default:
        // return `${environment.globalLoginUrl}?action=resetpassword&apiKey=`;
    }
    return '';
  }

  /**
   * resetPassword
   * @description make request to server to reset user password
   * @param [type] data [description]
   * @return Observable<any>      [description]
   */
  resetPassword(data: any): Observable<any> {
    return of({});
  }

  /**
   * mfaRegister
   * @description make request to server to register mobile number
   * @param  string  MFARigisterParams
   * @return Observable<any>
   */
  mfaRegister(data: MFARigisterParams): Observable<any>  {
    return of({});
  }

  /**
   * mfaVerify
   * @description make request to server to verify mfa code.
   * @param  string  code - mfa code got in phone number.
   * @return Observable<any>
   */
  mfaVerify(code: string): Observable<any>  {
    return of({});
  }

  private _handleMfaVerifyResponse(response: any): any {
    let stackList = [];
    if (response.stack) {
      stackList.push(response.stack);
    }
    if (response.stacks) {
      stackList = response.stacks;
    }
    this.storage.set('stacks', stackList);
    return {
      stacks: stackList
    };
  }

  /**
   * mfaSMS
   * @description make request to server to send sms to user mobile with code.
   * @return Observable<any>
   */
  mfaSMS(): Observable<any>  {
    return of({});
  }

  /**
   * switchStack
   * @description make request to server to log time when users switch stacks
   * @return Observable<any>
   */
  switchStack(stackUuid: string): Observable<any>  {
    return of({});
  }

  /**
   * getSingleStack
   * @description make request to server to get stack info of single stack
   * @return Observable<any>
   */
  getSingleStack(uuid: string): Observable<any>  {
    return of({});
  }

  /**
   * getStacksByUser
   * @description calling api to get stacks by user. This endpoint require an jwt token to identify the user.
   *              jwt attached in to request header.
   * @param apikey jwt pass to api to identify the user.
   * @param stackUuid This is an optinal data for api. Uuid of the stack, need to pass as query param.
   *              If want to get one stack of the this user. can pass stackUuid.
   *              If didn't pass API will reaturn all stacks user have access.
   */
  getStacksByUser(apikey: any): Observable<any> {
    const httpOption = {
      headers: { apikey }
    };
    return of({});
  }

  private _handlegetStacksResponse(stacks: any): any {
    if (!stacks) {
      return null;
    }
    let stackList = [];
    if (!Array.isArray(stacks)) {
      stackList.push(stacks);
      return {
        stacks: stackList
      };
    }
    stackList = stacks;
    this.storage.set('stacks', stackList);
    return {
      stacks: stackList
    };
  }

  getStacks(apiKey: any): Observable<any> {
    if (apiKey) {
      return this.getStacksByUser(apiKey);
    } else {
      const stackList = this.storage.get('stacks');
      // stackList.forEach(stack => {
      //   if (stack.lastLogin) {
      //     stack.lastLogin = this.utils.utcToLocal(new Date(stack.lastLogin));
      //   }
      // });
      return of(stackList);
    }
  }

  verifyRegistration(data: VerifyParams): Observable<any> {
    return of({});
  }

  /**
   * Use to get comfigaration for a custom domain
   * @param data config param object
   */
  getConfig(data: ConfigParams): Observable<{data: ExperienceConfig[]}> {
    return of({data: []});
  }

  /**
   * checkDomain
   * @description enforced domain checking before experience config API call
   * @param [type] data
   */
  checkDomain(data: any): Observable<any> {
    if (!data.domain) {
      throw new Error('Tech Error: Domain is compulsory!');
    }

    return this.getConfig(data);
  }

  saveRegistration(data: RegisterData): Observable<any> {
    return of({});
  }

}
