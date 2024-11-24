import { Component, OnInit } from '@angular/core';
import { AutheticationService } from 'src/app/authetication.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { ToastController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';  // Importar o Storage

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {
  userName: string = '';
  userEmail: string = '';
  userPhoto: string = 'assets/user-default.png';
  currentPassword: string = ''; // Senha atual
  newPassword: string = ''; // Nova senha

  isEditingName: boolean = false;
  isEditingPassword: boolean = false;
  changesMade: boolean = false;

  constructor(
    private authService: AutheticationService,
    private afAuth: AngularFireAuth,
    private firestore: AngularFirestore,
    private toastController: ToastController,
    private router: Router,
    private storage: Storage // Injetando o serviço de Storage
  ) {}

  ngOnInit() {
    // Carregar os dados do usuário
    this.authService.userDetails().subscribe((user) => {
      if (user) {
        this.userName = user.displayName || 'Nome não definido';
        this.userEmail = user.email || 'Email não disponível';

        // Carregar a foto salva do usuário do Ionic Storage
        this.storage.get('userPhoto_' + user.email).then((photo) => {
          if (photo) {
            this.userPhoto = photo; // Se existir, carrega a foto
          } else {
            this.userPhoto = 'assets/user-default.png'; // Foto padrão, caso não tenha sido definida
          }
        });
      }
    });
  }

  // Alternar entre edição e leitura
  toggleEdit(field: string) {
    if (field === 'name') {
      this.isEditingName = !this.isEditingName;
    } else if (field === 'password') {
      this.isEditingPassword = !this.isEditingPassword;
    }

    this.changesMade = true; // Habilitar botão de salvar
  }

  // Alterar a foto do usuário
  changePhoto() {
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*'; // Aceitar apenas arquivos de imagem
  
    fileInput.onchange = async (event: any) => {
      const file = event.target.files[0]; // Pegar o primeiro arquivo selecionado
      if (file) {
        // Criar uma URL temporária para a foto
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageUrl = reader.result as string;
          this.userPhoto = imageUrl; // Atualizar a foto na interface
  
          // Salvar a foto no Ionic Storage
          this.storage.set('userPhoto_' + this.userEmail, imageUrl).then(() => {
            this.presentToast('Foto atualizada com sucesso!');
          });
        };
        reader.readAsDataURL(file); // Ler o arquivo como uma URL base64
      } else {
        this.presentToast('Nenhuma foto foi selecionada.');
      }
    };
  
    fileInput.click(); // Abrir o seletor de arquivos
  }

  // Reautenticação do usuário
  async reauthenticateUser() {
    const user = await this.afAuth.currentUser;

    if (user && this.currentPassword) {
      // Realizar login com email e senha atuais
      const userCredential = await this.afAuth.signInWithEmailAndPassword(user.email || '', this.currentPassword);
      return userCredential; // Retornar o UserCredential após a reautenticação
    } else {
      this.presentToast('Por favor, insira sua senha atual.');
      throw new Error('Senha atual necessária');
    }
  }

  // Salvar alterações no Firebase
  async saveChanges() {
    try {
      const user = await this.afAuth.currentUser;

      if (!user) {
        this.presentToast('Usuário não autenticado.');
        return;
      }

      // Reautenticar o usuário
      await this.reauthenticateUser();

      // Atualizar nome
      if (this.isEditingName) {
        await user.updateProfile({ displayName: this.userName }); // Atualizar nome
      }

      // Atualizar senha
      if (this.newPassword) {
        await user.updatePassword(this.newPassword);
        this.presentToast('Senha alterada com sucesso!');
      }

      // Atualizar dados no Firestore (opcional)
      const userDoc = this.firestore.collection('usuarios').doc(user.uid);
      await userDoc.update({ nome: this.userName });

      this.presentToast('Alterações salvas com sucesso!');
      this.isEditingName = false;
      this.isEditingPassword = false;
      this.changesMade = false;
      this.newPassword = '';
      this.currentPassword = ''; // Limpar campo de senha atual após salvar
    } catch (error) {
      
    }
  }

  async presentToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 2000,
      position: 'top',
    });
    toast.present();
  }
}