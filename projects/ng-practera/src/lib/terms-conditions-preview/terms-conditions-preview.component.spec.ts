import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';

import { TermsConditionsPreviewComponent } from './terms-conditions-preview.component';

describe('TermsConditionsPreviewComponent', () => {
  let component: TermsConditionsPreviewComponent;
  let fixture: ComponentFixture<TermsConditionsPreviewComponent>;
  let ModalControllerSpy: jasmine.SpyObj<ModalController>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TermsConditionsPreviewComponent ],
      providers: [
        {
          provide: ModalController,
          useValue: jasmine.createSpyObj('ModalController', ['dismiss'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TermsConditionsPreviewComponent);
    component = fixture.componentInstance;
    ModalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call dismiss for modal', () => {
    component.close(true);
    expect(ModalControllerSpy.dismiss).toHaveBeenCalledWith({
      isAgreed: true
    });
  });
});
