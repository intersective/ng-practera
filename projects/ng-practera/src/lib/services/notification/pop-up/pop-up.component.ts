import { Component } from '@angular/core';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'prac-pop-up',
  templateUrl: 'pop-up.component.html'
})
export class PopUpComponent {
  type = '';
  data = {};

  constructor(
    public modalController: ModalController
  ) {}

  confirmed(): void {
    this.modalController.dismiss();
  }
}
