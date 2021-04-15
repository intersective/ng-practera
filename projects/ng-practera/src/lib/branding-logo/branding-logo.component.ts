import { Component, Input } from '@angular/core';

@Component({
  selector: 'prac-branding-logo',
  templateUrl: './branding-logo.component.html'
})
export class BrandingLogoComponent {

  @Input() bradingLogo = '';

  constructor() { }

}
