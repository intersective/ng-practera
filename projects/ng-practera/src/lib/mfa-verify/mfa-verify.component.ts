import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';

import { NgPracteraService } from '../ng-practera.service';

@Component({
  selector: 'prac-mfa-verify',
  templateUrl: './mfa-verify.component.html',
  styleUrls: ['./mfa-verify.component.scss']
})
export class MfaVerifyComponent implements OnInit {

  callApi = true;

  @Input() bradingLogo = '';
  @Input() internalUse = false;
  @Output() verifySuccessCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendSMSSuccessCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() verifyClickCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() sendSMSClickCallBack?: EventEmitter<any> = new EventEmitter<any>();

  verifyCode = '';
  // variable to control the label of the button
  isVerifying = false;

  constructor(
    private readonly practeraService: NgPracteraService,
  ) {
    this.getConfig();
  }

  ngOnInit(): void {
    this.verifyCode = '';
    this.isVerifying = false;
  }

  getConfig(): void {
    if (!this.internalUse && this.practeraService.getLibraryConfig()) {
      this.callApi = this.practeraService.getLibraryConfig().callApi;
    }
  }

  sendSMS(): any {
    if (!this.callApi && this.sendSMSClickCallBack) {
      this.sendSMSClickCallBack.emit(true);
      return null;
    }
    this.practeraService.mfaSMS().subscribe(
      response => {
        if (this.sendSMSSuccessCallBack) {
          this.sendSMSSuccessCallBack.emit(response);
        }
      },
      err => {
        this._handleError('smsAPI', err);
      }
    );
  }

  codeVerification(): any {
    this.isVerifying = true;
    if (!this.callApi && this.verifyClickCallBack) {
      this.verifyClickCallBack.emit(true);
      this.isVerifying = false;
      return null;
    }
    this.practeraService.mfaVerify(this.verifyCode).subscribe(
      response => {
        if (this.verifySuccessCallBack) {
          this.verifySuccessCallBack.emit(response);
        }
      },
      err => {
        this._handleError('verifyAPI', err);
      }
    );
  }

  private _handleError(type: string, error?: any): void {
    this.isVerifying = false;
    const statusCode = error ? error.status : null;
    const errorObject = {
      type,
      message: 'Internal error, please try again.',
      error
    };
    switch (type) {
      case 'smsAPI':
        if (statusCode === 401) {
          errorObject.message = 'Mobile number not registered. Please register mobile numbert to send SMS.';
          break;
        }
        errorObject.message = 'Varification code send failed, please try again.';
        break;
      case 'verifyAPI':
        if (statusCode === 401) {
          errorObject.message = 'Verification code incorrect. Please check and enter again.';
          break;
        }
        errorObject.message = 'Code varification failed, please try again.';
        break;
    }
    this.errorCallBack.emit(errorObject);
  }

}
