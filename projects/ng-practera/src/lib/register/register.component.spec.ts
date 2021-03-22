import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ModalController } from '@ionic/angular';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Md5 } from 'ts-md5/dist/md5';
import {
  Validators,
  FormControl,
  FormGroup,
} from '@angular/forms';

import { NgPracteraService } from '../ng-practera.service';
import { UtilsService } from '../services/utils/utils.service';

import { RegisterComponent } from './register.component';
import { TermsConditionsPreviewComponent } from '../terms-conditions-preview/terms-conditions-preview.component';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let ModalControllerSpy: jasmine.SpyObj<ModalController>;
  let serviceSpy: jasmine.SpyObj<NgPracteraService>;
  let utilSpy: jasmine.SpyObj<UtilsService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RegisterComponent ],
      providers: [
        NgPracteraService,
        UtilsService,
        {
          provide: ModalController,
          useValue: jasmine.createSpyObj('ModalController', ['dismiss'])
        }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    ModalControllerSpy = TestBed.inject(ModalController) as jasmine.SpyObj<ModalController>;
    serviceSpy = TestBed.inject(NgPracteraService) as jasmine.SpyObj<NgPracteraService>;
    utilSpy = TestBed.inject(UtilsService) as jasmine.SpyObj<UtilsService>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
