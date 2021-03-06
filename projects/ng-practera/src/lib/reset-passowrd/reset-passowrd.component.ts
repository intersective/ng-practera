import { Component, Output, Input, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';
import { NgPracteraService } from '../ng-practera.service';

@Component({
  selector: 'prac-reset-passowrd',
  templateUrl: './reset-passowrd.component.html',
  styleUrls: ['./reset-passowrd.component.scss']
})
export class ResetPassowrdComponent {

  callApi = true;

  @Input() bradingLogo = '';
  @Output() successCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() resetClickCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() loginClickCallBack: EventEmitter<any> = new EventEmitter<any>();

  isResetting = false;
  showPassword = false;

  resetPasswordForm = new FormGroup({
    password: new FormControl('', [Validators.required]),
    confirmPassword: new FormControl('', [Validators.required]),
  }, { validators: this.checkPasswordMatching });

  constructor(
    private readonly practeraService: NgPracteraService
  ) {
    this.getConfig();
  }

  getConfig(): void {
    if (this.practeraService.getLibraryConfig()) {
      this.callApi = this.practeraService.getLibraryConfig().callApi;
    }
  }

  resetPassword(): any {
    const data = {
      password: this.resetPasswordForm.controls.password.value
    };
    this.isResetting = true;

    if (!this.callApi && this.resetClickCallBack) {
      return this.resetClickCallBack.emit(true);
    }

    this.practeraService.resetPassword(data).subscribe(
      res => {
        this.isResetting = false;
        if (this.successCallBack) {
          this.successCallBack.emit(res);
        }
      },
      err => {
        this._handleError('API', err);
      }
    );
    return null;
  }

  checkPasswordMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password');
    const confirmPassword = control.get('confirmPassword');

    return password === confirmPassword ? null : { notMatching : true };
  }

  loginClick(): any {
    this.loginClickCallBack.emit(true);
  }

  private _handleError(type: string, error?: any): void {
    this.isResetting = false;
    const statusCode = error ? error.status : null;
    const errorObject = {
      type,
      message: 'Error updating password.Try again',
      error
    };
    if (type === 'API' && statusCode === 400 && error.error && error.error.passwordCompromised) {
      errorObject.message = `We’ve checked this password against a global database of insecure passwords and your password was on it. <br> Please try again. <br> You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`;
    }
    this.errorCallBack.emit(errorObject);
  }

}
