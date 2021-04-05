import { Component, Input } from '@angular/core';
import { BrowserStorageService } from '../services/storage/storage.service';

@Component({
  selector: 'prac-branding-logo',
  templateUrl: './branding-logo.component.html'
})
export class BrandingLogoComponent {

  @Input() bradingLogo = '';

  constructor(public storage: BrowserStorageService) { }

}
