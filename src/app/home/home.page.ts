import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AutheticationService } from 'src/app/authetication.service';
import { Storage } from '@ionic/storage-angular';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  posts: any[] = []; // Armazena os posts carregados do Firestore
  isModalOpen = false;
  selectedProduct: any;
  userEmail: string | null = null;
  userName: string = 'Nome do Usuário'; // Variável que irá armazenar o nome do usuário
  userPhoto: string = 'assets/user-default.png'; // Caminho para a foto do usuário

  // Lista de produtos (local storage)
  products: any[] = [];

  constructor(
    private router: Router,
    private authService: AutheticationService,
    private storage: Storage,
    private postService: PostService
  ) {}

  async ngOnInit() {
    await this.storage.create(); // Inicializa o Storage

    // Carregar produtos do local storage
    const storedProducts = await this.storage.get('products');
    if (storedProducts) {
      this.products = storedProducts;
    }

    // Carregar informações do usuário autenticado
    this.authService.userDetails().subscribe((userDetails) => {
      if (userDetails) {
        this.userEmail = userDetails.email;
        this.userName = userDetails.displayName || 'Nome não definido';
        this.userPhoto = userDetails.photoURL || 'assets/user-default.png';
        this.saveUserPhoto(userDetails.photoURL);
      }
    });

    // Carregar os posts do Firestore
    this.loadPosts();
  }

  async loadPosts() {
    this.postService.getPosts().subscribe(
      (data) => {
        this.posts = data; // Atualiza a lista de posts com os dados do Firestore
        console.log('Posts carregados:', this.posts);
      },
      (error) => {
        console.error('Erro ao carregar posts:', error);
      }
    );
  }

  async saveUserPhoto(photoURL: string | null) {
    if (photoURL) {
      await this.storage.set('userPhoto_' + this.userEmail, photoURL);
    }
  }

  async loadUserPhoto() {
    if (this.userEmail) {
      const storedPhoto = await this.storage.get('userPhoto_' + this.userEmail);
      if (storedPhoto) {
        this.userPhoto = storedPhoto;
      }
    }
  }

  async addProduct(product: any) {
    this.products.push(product);
    await this.storage.set('products', this.products);
  }

  PostPag() {
    this.router.navigate(['/post']);
  }

  setOpen(isOpen: boolean, product?: any) {
    this.isModalOpen = isOpen;
    if (isOpen && product) {
      this.selectedProduct = product;
    }
  }

  logoutUser() {
    this.authService
      .logoutUser()
      .then(() => {
        this.router.navigate(['/login']);
      })
      .catch((error) => {
        console.error('Erro ao deslogar: ', error);
      });
  }

  generateMapLink(market: string | undefined): string {
    if (!market) return '';

    const marketLocations: { [key: string]: string } = {
      'Guanabara - Bonsucesso': 'https://maps.app.goo.gl/PCF1Qfv6uHSZHPX59',
      'Guanabara - Penha': 'https://maps.app.goo.gl/bVbk81B5PwchFNzu8',
      'Guanabara - Engenho da rainha': 'https://maps.app.goo.gl/MpbAySE5VcCKYQkY6',
      'Supermarket - Bonsucesso': 'https://maps.app.goo.gl/gvC8SCKWTKf5JnScA',
      'Supermarket - Maria da graça': 'https://maps.app.goo.gl/fNrmCLmaGSG1NZ7E9',
      'Supermarket - Pilares': 'https://maps.app.goo.gl/fuuqxcQmBTS4BogY6',
    };

    return marketLocations[market] || 'https://www.google.com/maps';
  }

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  devs() {
    this.router.navigate(['/desenvolvedores']);
  }
}
