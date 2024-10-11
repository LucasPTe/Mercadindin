import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth'; // Importa o serviço de autenticação do Firebase
import { AutheticationService } from 'src/app/authetication.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isModalOpen = false;
  selectedProduct: any;  // Variável para armazenar o produto selecionado
  userEmail: string | null = null;  // Variável para armazenar o e-mail do usuário

  // Lista de produtos
  products = [
    {
      title: 'Arroz Branco - Princesa 5kg',
      subtitle: 'Supermercado Guanabara - Penha',
      price: 'R$ 5,99',
      image: 'assets/images/img_home/Arroz_branco.jpg',
      description: 'Descrição específica do Arroz Branco.'
    },
    {
      title: 'Feijão Preto - Marca X 1kg',
      subtitle: 'Supermercado Guanabara - Penha',
      price: 'R$ 7,99',
      image: 'assets/images/img_home/feijao_preto.png',
      description: 'Descrição específica do Feijão Preto.'
    }
  ];

  constructor(private router: Router, private afAuth: AngularFireAuth, private authService: AutheticationService) {}

  ngOnInit() {
    // Verifica o estado de autenticação do usuário
    this.afAuth.authState.subscribe(user => {
      if (user) {
        this.userEmail = user.email; // Armazena o e-mail do usuário logado
      } else {
        this.userEmail = null; // Se não estiver logado, o e-mail será null
      }
    });
  }

  // Método que navega para outras páginas
  navigateTo(page: string) {
    this.router.navigate([`/${page}`]);
  }

  PostPag() {
    this.router.navigate(['/post']);
  }

  // Método que abre o modal e define o produto selecionado
  setOpen(isOpen: boolean, product?: any) {
    this.isModalOpen = isOpen;
    if (isOpen && product) {
      this.selectedProduct = product;
    }
  }

  // Método de logout
  logoutUser() {
    this.authService.logoutUser().then(() => {
      this.router.navigate(['/login']);  // Redireciona para a tela de login
    }).catch(error => {
      console.error('Erro ao deslogar: ', error);
    });
  }
}
