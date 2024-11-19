import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AutheticationService } from 'src/app/authetication.service';
import { Storage } from '@ionic/storage-angular';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit {
  isModalOpen = false;
  selectedProduct: any;
  userEmail: string | null = null;

  // Lista de produtos
  products: any[] = [];

  constructor(
    private router: Router,
    private afAuth: AngularFireAuth,
    private authService: AutheticationService,
    private storage: Storage // Adiciona o serviço de Storage
  ) {}

  async ionViewWillEnter() {
    // Recarrega os produtos do Local Storage sempre que a página é exibida
    const storedProducts = await this.storage.get('products');
    this.products = storedProducts || [];
    console.log('Produtos carregados ao entrar na página:', this.products);
  }
  
  async ngOnInit() {
    await this.storage.create(); // Inicializa o Storage
  
    try {
      const storedProducts = await this.storage.get('products'); // Recupera os produtos salvos
      if (storedProducts) {
        this.products = storedProducts; // Atualiza a lista de produtos
        console.log('Produtos carregados:', this.products); // Log para depuração
      }
    } catch (error) {
      console.error('Erro ao carregar os produtos:', error);
    }
      // Obtem o e-mail do usuário logado
    this.afAuth.authState.subscribe(user => {
      this.userEmail = user ? user.email : null;
    });
  }

  async addProduct(product: any) {
    this.products.push(product); // Adiciona o produto à lista
    await this.storage.set('products', this.products); // Salva no Storage
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
    this.authService.logoutUser().then(() => {
      this.router.navigate(['/login']);
    }).catch(error => {
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
}