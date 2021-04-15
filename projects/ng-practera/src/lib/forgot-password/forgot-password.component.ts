import { Component, Output, Input, EventEmitter } from '@angular/core';

import { UtilsService } from '../services/utils/utils.service';
import { NgPracteraService } from '../ng-practera.service';

@Component({
  selector: 'prac-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent {


  callApi = true;
  @Input() bradingLogo = '';
  @Input() internalUse = false;
  @Output() successCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendEmailClickCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() loginClickCallBack: EventEmitter<any> = new EventEmitter<any>();

  email = '';
  // variable to control the label of the button
  isSending = false;

  constructor(
    private readonly practeraService: NgPracteraService,
    private readonly utils: UtilsService,
  ) {
    this.getConfig();
  }

  getConfig(): void {
    if (!this.internalUse && this.practeraService.getLibraryConfig()) {
      this.callApi = this.practeraService.getLibraryConfig().callApi;
    }
  }

  send(): any {
    // basic validation
    if (this.email.length < 0 || !this.email) {
      return this._handleError('empty');
    }
    this.isSending = true;

    if (!this.callApi && this.sendEmailClickCallBack) {
      this.sendEmailClickCallBack.emit(true);
      return null;
    }

    // call API to do forgot password logic
    return this.practeraService.forgotPassword(this.email).subscribe(
      res => {
        this.isSending = false;
        if (this.successCallBack) {
          this.successCallBack.emit({
            email: this.email
          });
        }
        return;
      },
      err => {
        this.isSending = false;
        this._handleError('API', err);
      }
    );
  }

  loginClick(): any {
    this.loginClickCallBack.emit(true);
  }

  private _handleError(type: string, error?: any): void {
    this.isSending = false;
    const errorObject = {
      type,
      message: 'Internal error, please try again.'
    };
    switch (type) {
      case 'empty':
        errorObject.message = 'Please enter email.';
        break;
      case 'API':
      // if trying to reset password too frequently
        if (this.utils.has(error, 'error.type') && error.error.type === 'reset_too_frequently') {
          errorObject.message = `Please wait 2 minutes before attempting to reset your password again`;
        } else {
          errorObject.message = `Issue occured. Please try again`;
        }
        break;
    }
    this.errorCallBack.emit(errorObject);
  }

}
