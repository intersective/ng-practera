# @practera/ng-practera

Angular components library made using Ionic components for Practera.

This angular library was generated with [Angular CLI](https://github.com/angular/angular-cli) version 11.1.0.

# Health

[![Quality Gate Status](https://sonarcloud.io/api/project_badges/measure?project=intersective_ng-practera&metric=alert_status&token=19814e72d32dd8ab193bb168320116a41f84beb3)](https://sonarcloud.io/dashboard?id=intersective_ng-practera) [![Coverage](https://sonarcloud.io/api/project_badges/measure?project=intersective_ng-practera&metric=coverage&token=19814e72d32dd8ab193bb168320116a41f84beb3)](https://sonarcloud.io/dashboard?id=intersective_ng-practera) [![Security Rating](https://sonarcloud.io/api/project_badges/measure?project=intersective_ng-practera&metric=security_rating&token=19814e72d32dd8ab193bb168320116a41f84beb3)](https://sonarcloud.io/dashboard?id=intersective_ng-practera) [![Maintainability Rating](https://sonarcloud.io/api/project_badges/measure?project=intersective_ng-practera&metric=sqale_rating&token=19814e72d32dd8ab193bb168320116a41f84beb3)](https://sonarcloud.io/dashboard?id=intersective_ng-practera) [![Bugs](https://sonarcloud.io/api/project_badges/measure?project=intersective_ng-practera&metric=bugs&token=19814e72d32dd8ab193bb168320116a41f84beb3)](https://sonarcloud.io/dashboard?id=intersective_ng-practera) [![Code Smells](https://sonarcloud.io/api/project_badges/measure?project=intersective_ng-practera&metric=code_smells&token=19814e72d32dd8ab193bb168320116a41f84beb3)](https://sonarcloud.io/dashboard?id=intersective_ng-practera)

# Table of Contents
- [Install](#install)
- [Import](#import)
    - [TypeScript](#typescript)
    - [HTML](#html)
- [Workflows](#workflows)
    - [Login Workflow](#login-workflow)
- [Pages](#pages)
    - [Login](#login)
    - [Forgot Password](#forgot-password)
    - [Reset Password](#reset-password)
    - [Registration](#registration)
    - [MFA Register](#mfa-register)
    - [MFA Verify](#mfa-verify)
- [Components](#components)
    - [Branding logo](#branding-logo)
    - [Direct link](#direct-link)

# Install
```
$ npm install @practera/ng-practera
```
# Import

### TypeScript

import the component in the module file that you need to use it.
``` ts
import { NgPracteraModule } from '@practera/ng-practera';
```
put `NgPracteraModule` under `imports` of the module.
```ts
@NgModule({
  imports: [
    NgPracteraModule.forRoot({
      env: 'sandbox',
      callApi: true
    })
  ]
})
```
| Property name | Values | Description |
| :------------ | :------------- | :----------- |
| env | `'sandbox'`, `'stage'`, `'live'` default is `'sandbox'` | You need to pass angular app envirenment. This use to Identify and call correct API and render correct components|
| callApi | `true` or `false` default is `true` | This is for Enable and Disable calling APIs. if `callApi` is `true` then components will call APIs and return responses to the call back funtions. if `callApi` is `false` components will not call APIs.|

### HTML
Put libary page tags between `ion-content`.
Eg:-
```html
<ion-content>
  <prac-login></prac-login>
</ion-content>
```

# Workflows
Workflows are combination of pages work as one unit. Workflows always calling APIs. If you pass `callApi` as `false` when importing workflows ignoring it and calling APIs.

### Login Workflow
- This is full login workflow and it have login, forgot password, MFA Register, MFA Verify pages. `MFA pages, that means two factor authendication pages. Not every user have this feature, but if user have that then they need to register their phone number to the system and verify the caodes they getting when they login.`
- When the workflow load initialy it load `login` page. then user can ether login by entering Username and password or navigate to `forgot password` page and get password rest email by typing user email.
- When user login by entering Username and password if user need to setup thire phone number then user will navigate to `MFA Register` page. From that page users can register their phone number with system by selecting the country and entering phone number. And after that user will navigate to `MFA Verify` page. From that page user need to enter code they get to their mobile and verify that.
- If user already register their phone number then they will navigate to `MFA verify` page after login. Then they can verify code to login.

```html
<prac-auth></prac-auth>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| bradingLogo | **`Required property`**. Logo for custom branding. This Logo showing on top of the page.|
| successCallBack | **`Required property`**. Menthod to call after  success the auth API responses. This is calling when MFA virify success and when login if no MFA thing required. | 
| errorCallBack | **`Required property`**. Menthod to call after any api return error response or any other error. |

```html
<ion-content color="light" class="ion-text-center">
  <prac-auth 
  [bradingLogo]="customLogo"
  (successCallBack)="successCallBack($event)" 
  (errorCallBack)="errorCallBack($event)"></prac-auth>

```

# Pages

### Login
Component is the login UI. it have login form (text fields, buttons), forgot passowrd link and 'Powered by practera' section.
```html
<prac-login></prac-login>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| bradingLogo | **`Optional property`**. Logo for custom branding. This Logo showing on top of the page.|
| successCallBack | **`Optional property`**. Menthod to call after login api return success response. If `callApi` config is `true` this need to pass to get api return response. | 
| errorCallBack | **`Required property`**. Menthod to call after login api return error response or any other error. |
| forgotPasswordCallBack | **`Required property`**. Menthod to call after click on forgot password link.  |
| loginClickCallBack | **`Optional property`**. Menthod to call after click on login button. If `callApi` config is `false` this need to pass to get login button click. |

```html
<ion-content color="light" class="ion-text-center">
  <prac-login 
  [bradingLogo]="customLogo"
  (successCallBack)="successCallBack($event)" 
  (errorCallBack)="errorCallBack($event)"
  (forgotPasswordCallBack)="forgotPasswordCallBack($event)"></prac-login>

  <prac-login 
  [bradingLogo]="customLogo"
  (errorCallBack)="errorCallBack($event)"
  (forgotPasswordCallBack)="forgotPasswordCallBack($event)" 
  (loginClickCallBack)="loginClickCallBack($event)"></prac-login>
</ion-content>
```

### Forgot Password
Component is the forgot passowrd UI. it have text field to enter email, send email button, link to go back to login and 'Powered by practera' section.
```html
<prac-forgot-password></prac-forgot-password>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| bradingLogo | **`Optional property`**. Logo for custom branding. This Logo showing on top of the page.|
| successCallBack | **`Optional property`**. Menthod to call after forgot password api return success response. If `callApi` config is `true` this need to pass to get api return response. | 
| errorCallBack | **`Required property`**. Menthod to call after forgot password api return error response or any other error. |
| sendEmailClickCallBack | **`Optional property`**. Menthod to call after click on send email button. If `callApi` config is `false` this need to pass to get send email button click.  |
| loginClickCallBack | **`Required property`**. Menthod to call after click on login link.` |

```html
<ion-content color="light" class="ion-text-center">
  <prac-forgot-password 
  [bradingLogo]="customLogo"
  (successCallBack)="successCallBack($event)" 
  (errorCallBack)="errorCallBack($event)" 
  (sendEmailClickCallBack)="sendEmailClickCallBack($event)"
  (loginClickCallBack)="loginClickCallBack($event)"></prac-forgot-password>

  <prac-forgot-password 
  [bradingLogo]="customLogo"
  (errorCallBack)="errorCallBack($event)"
  (sendEmailClickCallBack)="sendEmailClickCallBack($event)" 
  (loginClickCallBack)="loginClickCallBack($event)"></prac-forgot-password>
</ion-content>
```

### Reset Password
Component is the Reset password page UI. it have form with two text field and button, login page link and 'Powered by practera' section.
```html
<prac-reset-passowrd></prac-reset-passowrd>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| bradingLogo | **`Optional property`**. Logo for custom branding. This Logo showing on top of the page.|
| successCallBack | **`Optional property`**. Menthod to call after password rest api return success response. If `callApi` config is `true` this need to pass to get api return response. | 
| errorCallBack | **`Required property`**. Menthod to call after api return error response or any other error. |
| resetClickCallBack | **`Optional property`**. Menthod to call after click on 'change password' button. If `callApi` config is `false` this need to pass to get change password button click.  |
| loginClickCallBack | **`Required property`**. Menthod to call after click on login link. This need to pass to get login link click. |

```html
<ion-content color="light" class="ion-text-center">
  <prac-reset-passowrd 
  [bradingLogo]="customLogo"
  (successCallBack)="successCallBack($event)"
  (errorCallBack)="errorCallBack($event)"
  (loginClickCallBack)="loginClickCallBack($event)"></prac-reset-passowrd>

  <prac-reset-passowrd 
  [bradingLogo]="customLogo"
  (errorCallBack)="errorCallBack($event)"
  (loginClickCallBack)="loginClickCallBack($event)" 
  (resetClickCallBack)="resetClickCallBack($event)"></prac-reset-passowrd>
</ion-content>
```

### Registration
Component is the Registration page UI. It contains, unregister user direct link UI, register from contact number UI and normal registration UI with relevent field. Showing UI depend on data pass to the component and config of the app.
```html
<prac-register></prac-register>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| unRegisteredDirectLink | **`Optional property`**. For indicate unregisterd users using direct link to navigate to register page. default value is `false`. Pass it only if registration link have it.|
| domain | **`Optional property`**. To get configuration of the app related to domain URL. default value is `''`, empty string. Pass domain URL as `string` value. If `callApi` config is `true` this need to pass to get config of the app. |
| userPrams | **`Required property`**. User `email` and the `key` came in the registration link. default value is both `null`. Need to pass this to render UI properly and also to verify link if `callApi` config is `true`. |
| verifySuccessCallBack | **`Optional property`**. Menthod to call after verifying register link and get configuration for the app. Will return both API call response together. If `callApi` config is `true` this need to pass to get APIs return responses. | 
| registerSuccessCallBack | **`Optional property`**. Menthod to call after registration and login APIs return success responses. Both response will return together because after registration done login also happening. If `callApi` config is `true` this need to pass to get APIs return responses. | 
| errorCallBack | **`Required property`**. Menthod to call after api return error response or any other error. |
| registerClickCallBack | **`Optional property`**. Menthod to call after click on 'register' button. If `callApi` config is `false` this need to pass to get 'register' button click.  |

**RelatedData Formats**
- domain - sample URL value
  ```json
  "dev.abcd.com"
  ```
- userPrams
  ```json
  {
    "email": "",
    "key": ""
  }
  ```
- verifySuccessCallBack - returning both link verification and config responses.
  ```json
  {
    "userData": {},
    "configData": {}
  }
  ```
- registerSuccessCallBack - returning both register and login responses.
  ```json
  {
    "registrationResponse": {},
    "loginResponse": {}
  }
  ```

```html
<ion-content color="light" class="ion-text-center">
  <prac-register
  [domain]="app domain"
  [userPrams]="register link pram"
  (verifySuccessCallBack)="verifySuccessCallBack($event)"
  (registerSuccessCallBack)="registerSuccessCallBack($event)"
  (errorCallBack)="errorCallBack($event)" ></prac-register>

  <prac-register
  [unRegisteredDirectLink]="true" 
  [domain]="app domain"
  [userPrams]="register link pram"
  (verifySuccessCallBack)="verifySuccessCallBack($event)"
  (registerSuccessCallBack)="registerSuccessCallBack($event)"
  (errorCallBack)="errorCallBack($event)" ></prac-register>

  <prac-register 
  [userPrams]="register link pram"
  (errorCallBack)="errorCallBack($event)"
  (registerClickCallBack)="registerClickCallBack($event)"></prac-register>
</ion-content>
```

### MFA Register
Component is the MFA Register page UI. it have dropdown to select contury, text field to type mobile number, register button, link to go back to login and 'Powered by practera' section.
```html
<prac-mfa-register></prac-mfa-register>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| bradingLogo | **`Optional property`**. Logo for custom branding. This Logo showing on top of the page.|
| successCallBack | **`Optional property`**. Menthod to call after mfa register api return success response. If `callApi` config is `true` this need to pass to get api return response. | 
| errorCallBack | **`Required property`**. Menthod to call after mfa register api return error response or any other error. |
| registerClickCallBack | **`Optional property`**. Menthod to call after click on register button. If `callApi` config is `false` this need to pass to get send email button click.  |
| loginClickCallBack | **`Required property`**. Menthod to call after click on login link.  |

```html
<ion-content color="light" class="ion-text-center">
  <prac-mfa-register 
  [bradingLogo]="customLogo"
  (successCallBack)="successCallBack($event)" 
  (errorCallBack)="errorCallBack($event)" 
  (loginClickCallBack)="loginClickCallBack($event)"></prac-mfa-register>

  <prac-mfa-register 
  [bradingLogo]="customLogo"
  (errorCallBack)="errorCallBack($event)"
  (registerClickCallBack)="registerClickCallBack($event)" 
  (loginClickCallBack)="loginClickCallBack($event)"></prac-mfa-register>
</ion-content>
```

### MFA Verify
Component is the MFA Verify page UI. it have button to send SMS, text field to type verify code, 'Verify code' button and 'Powered by practera' section.
```html
<prac-mfa-verify></prac-mfa-verify>
```
**properties**
| Property name | Description      |
| :------------ | :--------------- |
| bradingLogo | **`Optional property`**. Logo for custom branding. This Logo showing on top of the page.|
| verifySuccessCallBack | **`Optional property`**. Menthod to call after mfa verify api return success response. If `callApi` config is `true` this need to pass to get api return response. | 
| sendSMSSuccessCallBack | **`Optional property`**. Menthod to call after send sms api return success response. If `callApi` config is `true` this need to pass to get api return response. | 
| errorCallBack | **`Required property`**. Menthod to call after api return error response or any other error. |
| verifyClickCallBack | **`Optional property`**. Menthod to call after click on 'verify code' button. If `callApi` config is `false` this need to pass to get verify code button click.  |
| sendSMSClickCallBack | **`Optional property`**. Menthod to call after click on send SMS button. If `callApi` config is `false` this need to pass to get send SMS button click.  |

```html
<ion-content color="light" class="ion-text-center">
  <prac-mfa-verify 
  [bradingLogo]="customLogo"
  (verifySuccessCallBack)="verifySuccessCallBack($event)"
  (sendSMSSuccessCallBack)="sendSMSSuccessCallBack($event)" 
  (errorCallBack)="errorCallBack($event)" ></prac-mfa-verify>

  <prac-mfa-verify 
  [bradingLogo]="customLogo"
  (errorCallBack)="errorCallBack($event)"
  (verifyClickCallBack)="verifyClickCallBack($event)" 
  (sendSMSClickCallBack)="sendSMSClickCallBack($event)"></prac-mfa-verify>
</ion-content>
```

# Components

### Branding logo
Component will show the preview of the image pass to it. It is mainly used for custom branding in authentication pages like login, forgot passowrd, etc to show client logo on the page.
```html
<prac-branding-logo></prac-branding-logo>
```
**properties**
| Property name | Description |
| :------------ | :----------- |
| bradingLogo | **`Required property`**. logo for custom branding. |
```html
<ion-content color="light" class="ion-text-center">

  <prac-branding-logo [bradingLogo]="customLogo"></prac-branding-logo>

  <prac-branding-logo [bradingLogo]="'/assets/logo.svg'"></prac-branding-logo>
</ion-content>
```

### Direct link
Component will show the waiting message with spinner for the direct links.
```html
<prac-direct-link></prac-direct-link>
```
**properties**
| Property name | Description |
| :------------ | :----------- |
| waitingMessage | **`Optional property`**. Waiting message to show on the page. |
```html
<ion-content color="light" class="ion-text-center">
  <prac-direct-link></prac-direct-link>

  <prac-direct-link [waitingMessage]="your waiting message"></prac-direct-link>
</ion-content>
```
