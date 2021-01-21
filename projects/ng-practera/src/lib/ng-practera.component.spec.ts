import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgPracteraComponent } from './ng-practera.component';

describe('NgPracteraComponent', () => {
  let component: NgPracteraComponent;
  let fixture: ComponentFixture<NgPracteraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgPracteraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NgPracteraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
