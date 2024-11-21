import { Component, OnInit } from '@angular/core';
import { AutheticationService } from 'src/app/authetication.service';  // Importando o serviço
import { Router } from '@angular/router';

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.page.html',
  styleUrls: ['./editar-usuario.page.scss'],
})
export class EditarUsuarioPage implements OnInit {

  userName: string = '';   // Variável para o nome do usuário
  userEmail: string = '';  // Variável para o email do usuário
  userPhoto: string = 'assets/user-default.png';  // Foto do usuário

  constructor(
    private authService: AutheticationService,  // Serviço para obter dados do Firebase
    private router: Router  // Navegação entre páginas
  ) {}

  ngOnInit() {
    // Aqui você pode carregar os dados do usuário do serviço de autenticação
    this.authService.userDetails().subscribe(user => {
      if (user) {
        this.userName = user.displayName || 'Nome não definido';
        this.userEmail = user.email || 'Email não disponível';
        this.userPhoto = user.photoURL || 'assets/user-default.png';
      }
    });
  }

  // Função para editar o nome
  editUserName() {
    // Aqui você pode implementar a lógica para permitir a edição do nome
    // Por enquanto, vamos permitir apenas a edição clicando na caneta
  }

  // Função para editar o email
  editUserEmail() {
    // Aqui você pode implementar a lógica para permitir a edição do email
    // Por enquanto, vamos permitir apenas a edição clicando na caneta
  }

  // Função para alterar a foto
  changePhoto() {
    // Lógica para alterar a foto (ainda não implementada)
    console.log('Alterando foto...');
    // Você pode integrar isso com uma funcionalidade de upload de imagem mais tarde.
  }

  saveChanges() {
    // Função para salvar as alterações
    console.log('Alterações salvas', this.userName, this.userEmail);
    // Aqui você pode chamar o serviço para atualizar o nome e o email do usuário no Firebase
  }
}
