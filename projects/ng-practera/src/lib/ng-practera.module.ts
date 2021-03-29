import { NgModule, InjectionToken, ModuleWithProviders } from '@angular/core';
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
import { DirectLinkComponent } from './direct-link/direct-link.component';
import { NgPracteraService, LibConfig } from './ng-practera.service';

export const LibConfigService = new InjectionToken<LibConfig>('LibConfig');

@NgModule({
  declarations: [
    LoginComponent,
    BrandingLogoComponent,
    ForgotPasswordComponent,
    MfaRegisterComponent,
    MfaVerifyComponent,
    ResetPassowrdComponent,
    RegisterComponent,
    TermsConditionsPreviewComponent,
    DirectLinkComponent],
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
    TermsConditionsPreviewComponent,
    DirectLinkComponent]
})
export class NgPracteraModule {
  static forRoot(config: LibConfig): ModuleWithProviders<any> {
    return {
      ngModule: NgPracteraModule,
      providers: [
        NgPracteraService,
        {
          provide: LibConfigService,
          useValue: config
        }
      ]
    };
  }
}
