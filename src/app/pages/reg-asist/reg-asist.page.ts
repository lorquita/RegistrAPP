import { Component, OnInit } from '@angular/core';
import { Barcode, BarcodeScanner } from '@capacitor-mlkit/barcode-scanning';
import { AlertController } from '@ionic/angular';

@Component({
  selector: 'app-reg-asist',
  templateUrl: './reg-asist.page.html',
  styleUrls: ['./reg-asist.page.scss'],
})
export class RegAsistPage implements OnInit {

  isSupported = false;
  barcodes: Barcode[] = [];

  constructor(private alertController : AlertController) { }

  ngOnInit() {
    BarcodeScanner.isSupported().then((result) =>{
      this.isSupported = result.supported;
    });
  }

  async scan(): Promise<void> {
    const granted = await this.requestPermissions();
    if (!granted) {
      this.presentAlert();
      return;
    }
    const { barcodes } = await BarcodeScanner.scan();
    this.barcodes.push(...barcodes);
  }

  async requestPermissions(): Promise<boolean> {
    const { camera } = await BarcodeScanner.requestPermissions();
    return camera === 'granted' || camera === 'limited';
  }

  async presentAlert(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Permiso Denegado',
      message: 'Porfavor, acepte los permisos de camara para usar el QR Scanner.',
      buttons: ['OK'],
    });
    await alert.present();
  }

}
