import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NgPracteraService } from '../ng-practera.service';

@Component({
  selector: 'prac-mfa-register',
  templateUrl: './mfa-register.component.html',
  styleUrls: ['./mfa-register.component.scss']
})
export class MfaRegisterComponent implements OnInit {

  callApi = this.practeraService.getLibraryConfig().callApi;

  @Output() successCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() registerClickCallBack?: EventEmitter<any> = new EventEmitter<any>();
  @Output() loginClickCallBack: EventEmitter<any> = new EventEmitter<any>();

  contactNumber = '';
  // variable to control the label of the button
  isRegistering = false;
  // default country model
  countryModel = '';
  // country model infomation
  activeCountryModelInfo = {
    countryCode: '',
    placeholder: '',
    pattern: '',
    length: ''
  };

  contactNumberFormat: any = {
    masks: {
      AUS: {
        format: '+61',
        placeholder: '000 000 000',
        pattern: '^[0-9]{3}[\s\-]?[\0-9]{3}[\s\-]?[0-9]{3}$',
        numberLength: '14'
      },
      US: {
        format: '+1',
        placeholder: '000 000 0000',
        pattern: '^[0-9]{3}[\s\-]?[\0-9]{3}[\s\-]?[0-9]{4}$',
        numberLength: '15'
      },
      NZ: {
        format: '+64',
        placeholder: '0000000000',
        pattern: '[0-10]{10}',
        numberLength: '15'
      },
      DE: {
        format: '+49',
        placeholder: '000 000 000',
        pattern: '^[0-9]{3}[\s\-]?[\0-9]{3}[\s\-]?[0-9]{3}$',
        numberLength: '26'
      },
      UK: {
        format: '+44',
        placeholder: '00 0000 0000',
        pattern: '^[0-9]{2}[\s\-]?[\0-9]{4}[\s\-]?[0-9]{4}$',
        numberLength: '15'
      },
      default: {
        format: '',
        placeholder: 'Mobile number',
        pattern: '',
        numberLength: ''
      }
    },
    countryCodes: [
      {
        name: 'Select country',
        code: 'default'
      },
      {
        name: 'Australia',
        code: 'AUS'
      },
      {
        name: 'US/Canada',
        code: 'US'
      },
      {
        name: 'New Zealand',
        code: 'NZ'
      },
      {
        name: 'Germany',
        code: 'DE'
      },
      {
        name: 'United Kingdom',
        code: 'UK'
      }
    ]
  };

  constructor(
    private readonly practeraService: NgPracteraService,
  ) { }

  ngOnInit(): void {
    this._initcomponent();
  }

  private _initcomponent(): void {
    this.countryModel = 'default';
    this.activeCountryModelInfo.countryCode = this.contactNumberFormat.masks[this.countryModel].format;
    this.activeCountryModelInfo.placeholder = this.contactNumberFormat.masks[this.countryModel].placeholder;
    this.activeCountryModelInfo.pattern = this.contactNumberFormat.masks[this.countryModel].pattern;
    this.activeCountryModelInfo.length = this.contactNumberFormat.masks[this.countryModel].numberLength;
  }

  updateCountry(): void {
    this.activeCountryModelInfo.countryCode = this.contactNumberFormat.masks[this.countryModel].format;
    this.activeCountryModelInfo.placeholder = this.contactNumberFormat.masks[this.countryModel].placeholder;
    this.activeCountryModelInfo.pattern = this.contactNumberFormat.masks[this.countryModel].pattern;
    this.activeCountryModelInfo.length = this.contactNumberFormat.masks[this.countryModel].numberLength;
    // set currentContactNumber to it's format.
    this.contactNumber = '';
  }

  /**
   * Accept only certain keys
   * @description accepted keys limited to:
   *              - 'ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'
   *              - numeric key input
   * @param  KeyboardEvent event code (function keypress) & key (for non-numeric input)
   * @return boolean             true: key accepted, false: key skipped
   */
  disableArrowKeys(event: KeyboardEvent): boolean {
    if (['ArrowLeft', 'ArrowRight', 'Backspace', 'Delete'].indexOf(event.code) !== -1) {
      return true;
    }
    if (this.isMaxLength()) {
      return false;
    }
    // skip all non-numeric input
    if (['1', '2', '3', '4', '5', '6', '7', '8', '9', '0'].indexOf(event.key) === -1) {
      return false;
    }
    return true;
  }

  isMaxLength(): boolean {
    if (this.countryModel === 'DE') {
      return false;
    }
    if (this.contactNumber.length < parseInt(this.activeCountryModelInfo.length, 10)) {
      return false;
    }
    return true;
  }

  formatContactNumber(): void {
    this.contactNumber = this._separeteContactNumber(this.contactNumber);
  }

  private _separeteContactNumber(text: string): string {
    const result = [];
    text = text.replace(/[^\d]/g, '');
    while (text.length >= 3) {
        result.push(text.substring(0, 3));
        text = text.substring(3);
    }
    if (text.length > 0) {
      result.push(text);
    }
    return result.join(' ');
  }

  loginClick(): any {
    this.loginClickCallBack.emit(true);
  }

  registerMFA(): any {
    this.isRegistering = true;
    if (!this.callApi && this.registerClickCallBack) {
      this.isRegistering = false;
      this.registerClickCallBack.emit(true);
      return null;
    }
    this.practeraService.mfaRegister({
      countryCode: this.activeCountryModelInfo.countryCode.substring(1),
      number: this.contactNumber.replace(/\s/g, '')
    }).subscribe(
      response => {
        this.isRegistering = false;
        if (this.successCallBack) {
          this.successCallBack.emit(response);
        }
      },
      err => {
        this._handleError('API', err);
      }
    );
  }

  private _handleError(type: string, error?: any): void {
    this.isRegistering = false;
    const errorObject = {
      type,
      message: 'Mobile number registration failed, please try again.',
      error
    };
    this.errorCallBack.emit(errorObject);
  }

}
