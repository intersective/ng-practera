import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgPracteraComponent } from './ng-practera.component';
import { LoginComponent } from './login/login.component';
import { BrandingLogoComponent } from './branding-logo/branding-logo.component';



@NgModule({
  declarations: [NgPracteraComponent, LoginComponent, BrandingLogoComponent],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  exports: [NgPracteraComponent, LoginComponent]
})
export class NgPracteraModule { }
