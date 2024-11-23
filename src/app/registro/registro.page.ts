import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.page.html',
  styleUrls: ['./registro.page.scss'],
})
export class RegistroPage implements OnInit {
  regForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastCtrl: ToastController,
    private router: Router
  ) {
    // Inicialização do FormGroup
    this.regForm = this.fb.group({
      fullname: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern("(?=.*\\d)(?=.*[a-z])(?=.*[A-Z]).{8,}")
      ]], // Validação de senha igual à da tela de login
    });
  }

  ngOnInit() {}

  async register() {
    if (this.regForm.valid) {
      const { fullname, email, password } = this.regForm.value;

      try {
        // Criar conta no Firebase Authentication
        const userCredential = await this.afAuth.createUserWithEmailAndPassword(email, password);
        const user = userCredential.user;

        if (user) {
          // Atualizar o perfil do usuário no Firebase Authentication
          await user.updateProfile({ displayName: fullname });

          // Salvar no Firestore (opcional)
          await this.firestore.collection('usuarios').doc(user.uid).set({
            nome: fullname,
            email: email,
            createdAt: new Date(),
          });

          // Exibir mensagem de sucesso e redirecionar
          await this.presentToast('Conta criada com sucesso!');
          this.router.navigate(['/login']);
        }
      } catch (error: any) {
        console.error('Erro ao registrar:', error);
        // Verifica o erro e exibe uma mensagem mais detalhada
        if (error.code === 'auth/email-already-in-use') {
          this.presentToast('Este e-mail já está em uso. Tente outro.');
        } else if (error.code === 'auth/invalid-email') {
          this.presentToast('O e-mail fornecido não é válido.');
        } else if (error.code === 'auth/weak-password') {
          this.presentToast('A senha precisa ser mais forte.');
        } else {
          this.presentToast('Conta criada com sucesso!');
          this.router.navigate(['/login']);
        }
      }
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastCtrl.create({
      message,
      duration: 3000,
      position: 'top',
    });
    toast.present();
  }
}