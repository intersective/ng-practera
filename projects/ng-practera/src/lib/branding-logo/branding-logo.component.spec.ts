import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BrandingLogoComponent } from './branding-logo.component';

describe('BrandingLogoComponent', () => {
  let component: BrandingLogoComponent;
  let fixture: ComponentFixture<BrandingLogoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BrandingLogoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BrandingLogoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
