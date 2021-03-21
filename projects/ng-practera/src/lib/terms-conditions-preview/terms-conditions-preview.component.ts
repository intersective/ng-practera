import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'prac-terms-conditions-preview',
  templateUrl: './terms-conditions-preview.component.html',
  styleUrls: ['./terms-conditions-preview.component.scss']
})
export class TermsConditionsPreviewComponent implements OnInit {

  termsURL: any;

  constructor(
    public modalController: ModalController,
    public sanitizer: DomSanitizer
  ) { }

  ngOnInit(): void {
    this.termsURL = this.sanitizer.bypassSecurityTrustResourceUrl('https://images.practera.com/terms_and_conditions/practera_default_terms_conditions_july2018.pdf#toolbar=0&navpanes=0&scrollbar=0"');
  }

  close(Agreed = false): void {
    this.modalController.dismiss({
      isAgreed: Agreed
    });
  }

}
