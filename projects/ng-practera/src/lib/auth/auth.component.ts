import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { UtilsService } from '../services/utils/utils.service';
import { BrowserStorageService } from '../services/storage/storage.service';
import { NotificationService } from '../services/notification/notification.service';

@Component({
  selector: 'prac-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss']
})
export class AuthComponent implements OnInit {

  showLogin: boolean;
  showForgotPassword: boolean;
  showMFARegister: boolean;
  showMFAVerify: boolean;

  @Input() bradingLogo = '';

  @Output() successCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly notificationService: NotificationService,
    private readonly utils: UtilsService,
    private readonly storage: BrowserStorageService
  ) {
    this.showLogin = true;
    this.showForgotPassword = false;
    this.showMFARegister = false;
    this.showMFAVerify = false;
  }

  ngOnInit(): void {
  }

  backToLoginCallBack(data: any): void {
    this._navigation('login');
  }

  forgotPasswordClickCallBack(data: any): void {
    this._navigation('forgot');
  }

  loginSuccessCallBack(loginResponse: any): any {
    if (!loginResponse.apikey) {
      console.error(`API response format error.\n login api missing apikey`);
      return null;
    }
    // Checking API return MFA messages and redirect user to MFA verify or register.
    if (this.utils.has(loginResponse, 'mfaRegistered')) {
      this.utils.setApiKey(loginResponse.apikey);
      this.storage.set('isLoggedIn', true);
      if (loginResponse.mfaRegistered) {
        this._navigation('mfaVerify');
        return null;
      } else {
        this._navigation('mfaRegister');
        return null;
      }
    }
    // If API didn't return MFA messages, emit the response
    this.successCallBack.emit(loginResponse);
  }

  forgotPasswordSuccessCallBack(data: any): any {
    // show pop up message for confirmation
    this.notificationService.popUp(
      'forgotPasswordConfirmation', {
        email: data.email
      }
    );
    this.backToLoginCallBack(true);
  }

  mfaRegisterSuccessCallBack(data: any): any {
    this._navigation('mfaVerify');
  }

  mfaVirifySuccessCallBack(data: any): any {
    this.successCallBack.emit(data);
  }

  sendSMSSuccessCallBack(data: any): any {
    // show alert message for confirmation
    this.notificationService.alert({
      message: 'Varification code has been sent to your mobile.',
      buttons: [
        {
          text: 'OK',
          role: 'cancel'
        },
      ],
    });
  }

  errorHandleCallBack(error: any): any {
    this.errorCallBack.emit(error);
    const errorType = error.type;
    const errorMessage = error.message;
    if (errorType.includes('API')) {
      this.notificationService.alert({
        message: errorMessage,
        buttons: [
          {
            text: 'OK',
            role: 'cancel'
          },
        ],
      });
    } else {
      this.notificationService.presentToast(errorMessage);
    }
  }

  private _navigation(page: string): void {
    this.showLogin = false;
    this.showForgotPassword = false;
    this.showMFARegister = false;
    this.showMFAVerify = false;

    switch (page) {
      case 'login':
      this.showLogin = true;
      this.showForgotPassword = false;
      this.showMFARegister = false;
      this.showMFAVerify = false;
      break;
      case 'forgot':
      this.showLogin = false;
      this.showForgotPassword = true;
      this.showMFARegister = false;
      this.showMFAVerify = false;
      break;
      case 'mfaRegister':
      this.showLogin = false;
      this.showForgotPassword = false;
      this.showMFARegister = true;
      this.showMFAVerify = false;
      break;
      case 'mfaVerify':
      this.showLogin = false;
      this.showForgotPassword = false;
      this.showMFARegister = false;
      this.showMFAVerify = true;
      break;
      default:
      this.showLogin = true;
      this.showForgotPassword = false;
      this.showMFARegister = false;
      this.showMFAVerify = false;
      break;
    }
  }

}
