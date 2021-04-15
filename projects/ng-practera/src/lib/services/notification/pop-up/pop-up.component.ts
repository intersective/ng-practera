import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'prac-pop-up',
  templateUrl: 'pop-up.component.html'
})
export class PopUpComponent {
  type = '';
  redirect = ['/'];
  data = {};

  constructor(
    private readonly router: Router,
    public modalController: ModalController
  ) {}

  confirmed(): void {
    this.modalController.dismiss();
    // if this.redirect == false, don't redirect to another page
    if (this.redirect) {
      this.router.navigate(this.redirect);
    }
  }
}
