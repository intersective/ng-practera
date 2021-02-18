import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MfaRegisterComponent } from './mfa-register.component';

describe('MfaRegisterComponent', () => {
  let component: MfaRegisterComponent;
  let fixture: ComponentFixture<MfaRegisterComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MfaRegisterComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MfaRegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
