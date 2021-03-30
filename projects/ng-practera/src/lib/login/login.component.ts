import { Component, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

import { UtilsService } from '../services/utils/utils.service';
import { NgPracteraService } from '../ng-practera.service';

@Component({
  selector: 'prac-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  callApi = true;

  @Output() successCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() forgotPasswordCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() loginClickCallBack?: EventEmitter<any> = new EventEmitter<any>();

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  isLoggingIn = false;
  showPassword = false;

  constructor(
    private utils: UtilsService,
    private readonly practeraService: NgPracteraService,
  ) {
    this.getConfig();
  }

  getConfig(): void {
    if (this.practeraService.getLibraryConfig()) {
      this.callApi = this.practeraService.getLibraryConfig().callApi;
    }
  }

  login(): any {
    if (this.utils.isEmpty(this.loginForm.value.username) || this.utils.isEmpty(this.loginForm.value.password)) {
      this._handleError('empty');
      return null;
    }
    if (!this.callApi && this.loginClickCallBack) {
      this.loginClickCallBack.emit(true);
      return null;
    }
    this.isLoggingIn = true;
    return this.practeraService.login({
      username: this.loginForm.value.username,
      password: this.loginForm.value.password,
    }).subscribe(
      response => {
        this.isLoggingIn = false;
        if (this.successCallBack) {
          this.successCallBack.emit(response);
        }
      },
      err => {
        // verify error status code
        this._handleError('API', err);
      }
    );
  }

  forgotPassowrdClick(): any {
    this.forgotPasswordCallBack.emit(true);
  }

  private _handleError(type: string, error?: any): void {
    this.isLoggingIn = false;
    const statusCode = error ? error.status : null;
    const errorObject = {
      type,
      message: 'Internal error, please try again.'
    };
    switch (type) {
      case 'empty':
        errorObject.message = 'Your username or password is empty, please fill them in.';
        break;
      case 'API':
        if (statusCode === 400 && error.error && error.error.passwordCompromised) {
          errorObject.message = `We’ve checked this password against a global database of insecure passwords and your password was on it. <br>
          Please try again. <br>
          You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`;
        } else if (statusCode === 400) {
          errorObject.message = 'Your username or password is incorrect, please try again.';
        }
        break;
    }
    this.errorCallBack.emit(errorObject);
  }

}
