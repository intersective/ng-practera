import { Injectable } from '@angular/core';
import { ModalController, AlertController, ToastController, LoadingController } from '@ionic/angular';
import { AlertOptions, ToastOptions, ModalOptions, LoadingOptions, IonicSafeString } from '@ionic/core';
import { PopUpComponent } from './pop-up/pop-up.component';
import { UtilsService } from '../utils/utils.service';

export interface CustomTostOptions {
  message: string;
  icon: string;
  duration?: string;
}
@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private readonly modalController: ModalController,
    private readonly alertController: AlertController,
    private readonly toastController: ToastController,
    private readonly loadingController: LoadingController,
    public utils: UtilsService,
  ) {}

  dismiss(): Promise<boolean> {
    return this.modalController.dismiss();
  }

  /**
   * modalConfig
   * @description futher customised filter
   */
  private modalConfig({ component, componentProps }: any, options = {}): ModalOptions {
    return Object.assign(
      {
        component,
        componentProps,
      },
      options
    );
  }

  // show pop up message
  // this is using pop-up.component.ts as the view
  // put redirect = false if don't need to redirect
  async popUp(type: any, data: any, redirect: any = false): Promise<void> {
    const component = PopUpComponent;
    const componentProps = {
      type,
      data,
      redirect,
    };
    return await this.modal(component, componentProps);
  }

  async modal(component: any, componentProps: any, options?: any, event?: any): Promise<void> {
    const modal = await this.modalOnly(component, componentProps, options, event);
    return modal.present();
  }

  async modalOnly(component: any, componentProps: any, options?: any, event?: any): Promise<HTMLIonModalElement> {
    const modal = await this.modalController.create(this.modalConfig({ component, componentProps }, options));

    if (event) {
      modal.onDidDismiss().then(event);
    }

    return modal;
  }

  async alert(config: AlertOptions): Promise<void> {
    const alert = await this.alertController.create(config);
    return await alert.present();
  }

  // toast message pop up, by default, shown success message for 2 seconds.
  async presentToast(message: string | IonicSafeString, options?: any): Promise<void> {
    let toastOptions: ToastOptions = {
      message,
      duration: 2000,
      position: 'top',
      color : 'danger'
    };
    toastOptions = Object.assign(toastOptions, options);
    const toast = await this.toastController.create(toastOptions);
    return toast.present();
  }

  async loading(opts?: LoadingOptions): Promise<void> {
    const loading = await this.loadingController.create(opts || {
      spinner: 'dots',
    });
    return loading.present();
  }
}
