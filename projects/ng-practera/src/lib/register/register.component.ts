import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import {
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';
import { ModalController } from '@ionic/angular';

import { NgPracteraService } from '../ng-practera.service';
import { UtilsService } from '../services/utils/utils.service';
import { TermsConditionsPreviewComponent } from '../terms-conditions-preview/terms-conditions-preview.component';

@Component({
  selector: 'prac-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  password = '';
  confirmPassword = '';
  isAgreed = false;
  registerationForm: FormGroup;
  hidePassword = false;
  user: any = {
    email: null,
    key: null,
    contact: null,
    id: null
  };
  // validation errors array
  errors: Array<any> = [];
  showPassword = false;
  // for unregisterd users using direct link
  @Input() unRegisteredDirectLink = false;
  // domain of the app to get the app configuration.
  @Input() domain = '';
  // user data for virify link and also for registration process.
  @Input() userPrams: any = {
    email: null,
    key: null
  };
  callApi = true;
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() verifySuccessCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() registerSuccessCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() registerClickCallBack?: EventEmitter<any> = new EventEmitter<any>();

  constructor(
    private readonly practeraService: NgPracteraService,
    private readonly utils: UtilsService,
    private readonly modalController: ModalController
  ) {
    this.callApi = this.practeraService.getLibraryConfig() ? this.practeraService.getLibraryConfig().callApi : true;
    this.registerationForm = new FormGroup({
      email: new FormControl('', [Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(8)
      ]),
      confirmPassword: new FormControl('', [Validators.required])
    });
  }

  ngOnInit(): void {
    // call link virify API calls if callApi is true.
    if (this.callApi) {
      this.verifyRegistrationLink();
    }
  }

  /**
   * check is register url valid or not.
   */
  verifyRegistrationLink(): any {
    this.user.email = this.userPrams.email;
    this.user.key = this.userPrams.key;

    if (this.user.email && this.user.key) {
      this.practeraService.verifyRegistration({
        email: this.user.email,
        key: this.user.key
      }).subscribe(
        response => {
          if (response) {
            const user = response.data.User;
            // Setting user data after registration verified.
            this.user.contact = (user || {}).contact_number || null;
            this.user.id = user.id;
            // get app configaration
            this._checkDomain();
          }
        },
        error => {
          this._handleError('verifyAPI', error);
        }
      );
    } else {
      this._handleError('verifyEmpty');
    }
  }

  /**
   * Get App configaration related to domain
   */
  private _checkDomain(): void {
    this.practeraService.checkDomain({
      domain: this.domain
    }).subscribe(
      res => {
        let data = (res.data || {}).data;
        data = this.utils.find(data, (datum: any) => {
          return (
            datum.config && datum.config.auth_via_contact_number
          );
        });
        if (data && data.config) {
          if (data.config.auth_via_contact_number === true) {
            this.hidePassword = true;
            this.user.password = this._autoGeneratePassword();
            this.confirmPassword = this.user.password;
          }
        }
        if (this.verifySuccessCallBack) {
          this.verifySuccessCallBack.emit({
            userData: this.user,
            configData: res.data
          });
        }
      },
      err => {
        this._handleError('verifyAPI', err);
      }
    );
  }

  private _autoGeneratePassword(): string {
    const text = Md5.hashStr('').toString();
    return text.substr(0, 8);
  }

  openLink(): void {
    const fileURL = 'https://images.practera.com/terms_and_conditions/practera_default_terms_conditions_july2018.pdf';
    window.open(fileURL, '_system');
  }

  register(): any {
    if (!this.callApi && this.registerClickCallBack) {
      this.registerClickCallBack.emit(true);
      return null;
    }
    if (this.validateRegistration()) {
      if (this.unRegisteredDirectLink) {
        this._setupPassword();
      }
      this.practeraService
        .saveRegistration({
          password: this.confirmPassword,
          user_id: this.user.id,
          key: this.user.key
        })
        .subscribe(
          registrationResponse => {
            this.practeraService
              .login({
                email: this.user.email,
                password: this.confirmPassword
              })
              .subscribe(
                async loginResponse => {
                  if (this.registerSuccessCallBack) {
                    this.registerSuccessCallBack.emit({
                      registrationResponse,
                      loginResponse
                    });
                  }
                },
                err => {
                  this._handleError('registerAPI', err);
                }
              );
          },
          error => {
            this._handleError('registerAPI', error);
          }
        );
    }
  }

  removeErrorMessages(): void {
    this.errors = [];
  }

  validateRegistration(): any {
    this.errors = [];
    const notAgreedError = 'You need to agree with terms and Conditions.';
    if (this.unRegisteredDirectLink) {
      if (!this.isAgreed) {
        this.errors.push(notAgreedError);
        return false;
      } else {
        return true;
      }
    }
    if (this.hidePassword) {
      if (!this.isAgreed) {
        this.errors.push(notAgreedError);
        return false;
      } else {
        return true;
      }
    } else if (this.registerationForm.valid) {
      return this._validateValidRegisterForm();
    } else {
      return this._validateInvalidRegisterForm();
    }
  }

  private _validateValidRegisterForm(): any {
    const notAgreedError = 'You need to agree with terms and Conditions.';
    const pass = this.registerationForm.controls.password.value;
    const confirmPass = this.registerationForm.controls.confirmPassword.value;
    if (pass !== confirmPass) {
      this.errors.push('Your passwords don\'t match.');
      return false;
    } else if (!this.isAgreed) {
      this.errors.push(notAgreedError);
      return false;
    } else {
      return true;
    }
  }

  private _validateInvalidRegisterForm(): any {
    let isValid = true;
    for (const controller in this.registerationForm.controls) {
      if (this.registerationForm.controls[controller].errors) {
        const errors: any = this.registerationForm.controls[controller].errors;
        isValid = false;
        for (const key in errors) {
          if (errors.hasOwnProperty(key)
          ) {
            switch (key) {
              case 'required':
                this.errors.push('Please fill in your password');
                break;
              case 'minlength':
                this.errors.push(
                  'Your password needs to be more than 8 characters.'
                );
                break;
              default:
                this.errors.push(errors[key]);
            }
            return false;
          }
        }
      }
    }
    return isValid;
  }

  private _setupPassword(): void {
    if (this.password) {
      this.user.password = this.password;
    } else {
      this.user.password = this._autoGeneratePassword();
    }
    this.confirmPassword = this.user.password;
  }

  async termsAndConditionsPopup(): Promise<any> {
    const modal = await this.modalController.create({
      component: TermsConditionsPreviewComponent,
      swipeToClose: false,
      backdropDismiss: false
    });
    await modal.present();
    modal.onWillDismiss().then((modalData) => {
      if (modalData.data && (modalData.data.isAgreed)) {
        this.isAgreed = modalData.data.isAgreed;
      }
    });
  }

  private _handleError(type: string, error?: any): void {
    const errorObject = {
      type,
      message: 'Internal error, please try again.',
      error
    };
    switch (type) {
      case 'verifyEmpty':
        errorObject.message = 'Registration link invalid!';
        errorObject.error = {error: 'Email or Key empty'};
        break;
      case 'verifyAPI':
        errorObject.message = 'Registration link invalid!';
        break;
      case 'registerAPI':
        if (error.error && error.error.passwordCompromised) {
          errorObject.message = `We’ve checked this password against a global database of insecure passwords and your password was on it. <br>
          Please try again. <br>
          You can learn more about how we check that <a href="https://haveibeenpwned.com/Passwords">database</a>`;
        } else {
          errorObject.message = `Registration not complete!`;
        }
        break;
    }
    this.errorCallBack.emit(errorObject);
  }

}
