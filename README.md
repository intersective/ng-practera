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
- **Branding logo**
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
- **Login**
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
  <prac-login (successCallBack)="successCallBack($event)" (errorCallBack)="errorCallBack($event)"
  (forgotPasswordCallBack)="forgotPasswordCallBack($event)"></prac-login>

  <prac-login [callApi]="false" (errorCallBack)="errorCallBack($event)"
  (forgotPasswordCallBack)="forgotPasswordCallBack($event)" (loginClickCallBack)="loginClickCallBack($event)"></prac-login>
  ```

- **Forgot Password**
