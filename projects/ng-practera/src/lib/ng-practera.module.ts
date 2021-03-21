import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './login/login.component';
import { BrandingLogoComponent } from './branding-logo/branding-logo.component';
import { ForgotPasswordComponent } from './forgot-password/forgot-password.component';
import { MfaRegisterComponent } from './mfa-register/mfa-register.component';
import { MfaVerifyComponent } from './mfa-verify/mfa-verify.component';
import { ResetPassowrdComponent } from './reset-passowrd/reset-passowrd.component';
import { RegisterComponent } from './register/register.component';
import { TermsConditionsPreviewComponent } from './terms-conditions-preview/terms-conditions-preview.component';

@NgModule({
  declarations: [
    LoginComponent,
    BrandingLogoComponent,
    ForgotPasswordComponent,
    MfaRegisterComponent,
    MfaVerifyComponent,
    ResetPassowrdComponent,
    RegisterComponent,
    TermsConditionsPreviewComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  entryComponents: [
    TermsConditionsPreviewComponent
  ],
  exports: [LoginComponent,
    BrandingLogoComponent,
    ForgotPasswordComponent,
    MfaRegisterComponent,
    MfaVerifyComponent,
    ResetPassowrdComponent,
    RegisterComponent,
    TermsConditionsPreviewComponent]
})
export class NgPracteraModule {}
