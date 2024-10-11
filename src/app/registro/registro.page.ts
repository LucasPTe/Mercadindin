import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {

  regForm!: FormGroup;

  constructor(
    public router: Router,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastController: ToastController, // Para exibir mensagens de erro ou sucesso
    public authService: AutheticationService
  ) { }

  ngOnInit() {
    this.regForm = this.formBuilder.group({
      fullname: ['', [Validators.required]],
      email: ['', [
        Validators.required,
        Validators.email,
        Validators.pattern("[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")
      ]],
      password: ['', [
        Validators.required,
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]]
    });
  }

  get errorControl() {
    return this.regForm.controls;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async registrar() {
    const loading = await this.loadingCtrl.create({
      message: 'Registrando...'
    });
    await loading.present();

    if (this.regForm.valid) {
      try {
        const user = await this.authService.registerUser(
          this.regForm.value.email,
          this.regForm.value.password
        );
        if (user) {
          loading.dismiss();
          this.router.navigate(['/home']);
          this.presentToast('Registro bem-sucedido!');
        }
      } catch (error: any) {  // Usar 'any' para acessar a propriedade 'message'
        console.error(error);
        loading.dismiss();
        this.presentToast('Erro ao registrar: ' + (error.message || 'Erro desconhecido'));
      }
    } else {
      loading.dismiss();
      this.presentToast('Por favor, preencha todos os campos corretamente.');
    }
  }

  LoginPag() {
    this.router.navigate(['/login']);
  }
}
