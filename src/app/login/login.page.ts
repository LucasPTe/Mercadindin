import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { LoadingController, ToastController } from '@ionic/angular';
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm!: FormGroup;

  constructor(
    private router: Router,
    public formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastController: ToastController,  // Para exibir mensagens ao usuário
    public authService: AutheticationService
  ) { }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
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
    return this.loginForm.controls;
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top'
    });
    toast.present();
  }

  async logar() {
    const loading = await this.loadingCtrl.create({
      message: 'Fazendo login...'
    });
    await loading.present();

    if (this.loginForm.valid) {
      try {
        // Chama o serviço de autenticação
        const user = await this.authService.loginUser(
          this.loginForm.value.email,
          this.loginForm.value.password
        );
        if (user) {
          loading.dismiss();
          this.router.navigate(['/home']);  // Redireciona para a página home
          this.presentToast('Login bem-sucedido!');
        }
      } catch (error: any) {
        console.error(error);
        loading.dismiss();
        this.presentToast('Erro ao fazer login: ' + (error.message || 'Erro desconhecido'));
      }
    } else {
      loading.dismiss();
      this.presentToast('Por favor, preencha todos os campos corretamente.');
    }
  }

  RegistroPag() {
    this.router.navigate(['/registro']);
  }
}
