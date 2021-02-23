# @practera/ng-practera

Angular components library made using Ionic components for Practera.

This angular library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.0.

## Install
```
$ npm install @practera/ng-practera
```
## Import
import the component in the module file that you need to use it.
``` ts
import { NgPracteraModule } from '@practera/ng-practera';
```
put `NgPracteraModule` under `imports` of the module.
```ts
@NgModule({
  imports: [
    NgPracteraModule
  ]
})
```

## Components
### Branding logo
Component will show the priview of the image pass to it. It mainly use for custom branding in authendication pages like login, forgot passowrd, etc to show client logo on the page.
```html
<prac-branding-logo></prac-branding-logo>
```
**properties**
| Property name | Description |
| :------------ | :----------- |
| bradingLogo | logo for custom branding. `Not Optional` |
```html
<prac-branding-logo [bradingLogo]="customeLogo"></prac-branding-logo>

<prac-branding-logo [bradingLogo]="'/assets/logo.svg'"></prac-branding-logo>
```
### Login
Component is the login UI. it have login form (text fields, buttons), forgot passowrd link and 'Powered by practera' section.
```html
<prac-login></prac-login>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| callApi | Boolean to enable and disable API calling of the component default value is `true` |
| successCallBack | Menthod to call after login api return success response. Optional property, if `callApi` is `true` this need to pass to get api return response. | 
| errorCallBack | Menthod to call after login api return error response or any other error. `Not Optional` |
| forgotPasswordCallBack | Menthod to call after click on forgot password link. `Not Optional`  |
| loginClickCallBack | Menthod to call after click on login button. Optional property, if `callApi` is `false` this need to pass to get login button click. |

```html
<prac-login 
(successCallBack)="successCallBack($event)" 
(errorCallBack)="errorCallBack($event)"
(forgotPasswordCallBack)="forgotPasswordCallBack($event)"></prac-login>

<prac-login 
[callApi]="false" 
(errorCallBack)="errorCallBack($event)"
(forgotPasswordCallBack)="forgotPasswordCallBack($event)" 
(loginClickCallBack)="loginClickCallBack($event)"></prac-login>
```

### Forgot Password
Component is the forgot passowrd UI. it have text field to enter email, send email button, link to go back to login and 'Powered by practera' section.
```html
<prac-forgot-password></prac-forgot-password>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| callApi | Boolean to enable and disable API calling of the component default value is `true` |
| successCallBack | Menthod to call after forgot password api return success response. Optional property, if `callApi` is `true` this need to pass to get api return response. | 
| errorCallBack | Menthod to call after forgot password api return error response or any other error. `Not Optional` |
| sendEmailClickCallBack | Menthod to call after click on send email button. Optional property, if `callApi` is `false` this need to pass to get send email button click.  |
| loginClickCallBack | Menthod to call after click on login link. `Not Optional` |

```html
<prac-forgot-password 
(successCallBack)="successCallBack($event)" 
(errorCallBack)="errorCallBack($event)" 
(sendEmailClickCallBack)="sendEmailClickCallBack($event)"
(loginClickCallBack)="loginClickCallBack($event)"></prac-forgot-password>

<prac-forgot-password 
[callApi]="false" 
(errorCallBack)="errorCallBack($event)"
(sendEmailClickCallBack)="sendEmailClickCallBack($event)" 
(loginClickCallBack)="loginClickCallBack($event)"></prac-forgot-password>
```

### MFA Register
Component is the MFA Register page UI. it have dropdown to select contury, text field to type mobile number, register button, link to go back to login and 'Powered by practera' section.
```html
<prac-mfa-register></prac-mfa-register>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| callApi | Boolean to enable and disable API calling of the component default value is `true` |
| successCallBack | Menthod to call after mfa register api return success response. Optional property, if `callApi` is `true` this need to pass to get api return response. | 
| errorCallBack | Menthod to call after mfa register api return error response or any other error. `Not Optional` |
| registerClickCallBack | Menthod to call after click on register button. Optional property, if `callApi` is `false` this need to pass to get send email button click.  |
| loginClickCallBack | Menthod to call after click on login link. `Not Optional` |

```html
<prac-mfa-register 
(successCallBack)="successCallBack($event)" 
(errorCallBack)="errorCallBack($event)" 
(loginClickCallBack)="loginClickCallBack($event)"></prac-mfa-register>

<prac-mfa-register 
[callApi]="false" 
(errorCallBack)="errorCallBack($event)"
(registerClickCallBack)="registerClickCallBack($event)" 
(loginClickCallBack)="loginClickCallBack($event)"></prac-mfa-register>
```

### MFA Verify
Component is the MFA Verify page UI. it have button to send SMS, text field to type verify code, 'Verify code' button and 'Powered by practera' section.
```html
<prac-mfa-verify></prac-mfa-verify>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| callApi | Boolean to enable and disable API calling of the component default value is `true` |
| verifySuccessCallBack | Menthod to call after mfa verify api return success response. Optional property, if `callApi` is `true` this need to pass to get api return response. | 
| sendSMSSuccessCallBack | Menthod to call after send sms api return success response. Optional property, if `callApi` is `true` this need to pass to get api return response. | 
| errorCallBack | Menthod to call after api return error response or any other error. `Not Optional` |
| verifyClickCallBack | Menthod to call after click on 'verify code' button. Optional property, if `callApi` is `false` this need to pass to get verify code button click.  |
| sendSMSClickCallBack | Menthod to call after click on send SMS button. Optional property, if `callApi` is `false` this need to pass to get send SMS button click.  |

```html
<prac-mfa-verify 
(verifySuccessCallBack)="verifySuccessCallBack($event)"
(sendSMSSuccessCallBack)="sendSMSSuccessCallBack($event)" 
(errorCallBack)="errorCallBack($event)" ></prac-mfa-verify>

<prac-mfa-verify 
[callApi]="false" 
(errorCallBack)="errorCallBack($event)"
(verifyClickCallBack)="verifyClickCallBack($event)" 
(sendSMSClickCallBack)="sendSMSClickCallBack($event)"></prac-mfa-verify>
```
