import { Component, Output, EventEmitter } from '@angular/core';
import { Validators, FormGroup, FormControl } from '@angular/forms';

@Component({
  selector: 'prac-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {

  @Output() successCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() errorCallBack: EventEmitter<any> = new EventEmitter<any>();
  @Output() forgotPasswordCallBack: EventEmitter<any> = new EventEmitter<any>();

  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
  });
  isLoggingIn = false;
  showPassword = false;

  constructor() {}

  login(): any {
    this.successCallBack.emit(true);
    this.errorCallBack.emit(true);
    this.forgotPasswordCallBack.emit(true);
  }
}
