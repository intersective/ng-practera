import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DirectLinkComponent } from './direct-link.component';

describe('DirectLinkComponent', () => {
  let component: DirectLinkComponent;
  let fixture: ComponentFixture<DirectLinkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DirectLinkComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DirectLinkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
