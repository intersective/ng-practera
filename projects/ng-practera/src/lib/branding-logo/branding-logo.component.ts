import { Component, OnInit, Input } from '@angular/core';
import { BrowserStorageService } from '../services/storage/storage.service';

@Component({
  selector: 'prac-branding-logo',
  templateUrl: './branding-logo.component.html',
  styleUrls: ['./branding-logo.component.css']
})
export class BrandingLogoComponent implements OnInit {

  constructor(public storage: BrowserStorageService) { }

  ngOnInit(): void {
  }

}
