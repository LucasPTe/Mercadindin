import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PostService } from '../services/post.service';

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  selectedImage: string | null = null;
  productTitle: string = '';
  selectedMarket: string = '';
  tempSelectedMarket: string = '';
  productPrice: string = 'R$ 0,00';
  userEmail: string | null = null;
  description: string = '';
  isModalOpen: boolean = false;

  defaultImage: string = 'assets/images/logo_mercadindin.png';

  markets: string[] = [
    'Guanabara - Bonsucesso',
    'Guanabara - Penha',
    'Guanabara - Engenho da rainha',
    'Supermarket - Bonsucesso',
    'Supermarket - Maria da graça',
    'Supermarket - Pilares',
  ];

  filteredMarkets: string[] = [...this.markets];
  searchText: string = '';

  constructor(
    private modalController: ModalController,
    private router: Router,
    private afAuth: AngularFireAuth,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userEmail = user.email;
      }
    });
  }

  openMarketSelectModal() {
    this.tempSelectedMarket = this.selectedMarket;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmSelection(selectedMarket: string) {
    this.selectedMarket = selectedMarket;
    this.isModalOpen = false;
  }

  filterMarkets() {
    this.filteredMarkets = this.markets.filter((market) =>
      market.toLowerCase().includes(this.searchText.toLowerCase())
    );
  }

  formatCurrency(value: string) {
    const numericValue = value.replace(/[^\d]/g, '');
    const formattedValue = (parseInt(numericValue, 10) / 100).toFixed(2);
    return `R$ ${formattedValue.replace('.', ',')}`;
  }

  onPriceChange(event: any) {
    const inputValue = event.target.value;
    this.productPrice = this.formatCurrency(inputValue);
  }

  async salvarPost() {
    if (
      !this.productTitle ||
      !this.selectedMarket ||
      !this.productPrice ||
      !this.selectedImage ||
      this.selectedImage === this.defaultImage
    ) {
      alert('Preencha todos os campos e insira uma imagem válida!');
      return;
    }

    const newProduct = {
      title: this.productTitle,
      subtitle: this.selectedMarket,
      price: this.productPrice,
      image: this.selectedImage,
      email: this.userEmail,
      description: this.description,
      createdAt: new Date(),
    };

    try {
      await this.postService.addPost(newProduct); // Salva no Firestore
      alert('Postagem criada com sucesso!');
      this.router.navigate(['/home']); // Redireciona para a página inicial
    } catch (error) {
      console.error('Erro ao salvar o post:', error);
      alert('Erro ao salvar a postagem. Tente novamente.');
    }
  }

  async tirarFoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.selectedImage = photo.dataUrl || null;
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    }
  }

  imagemSelecionada(evento: any) {
    const arquivo = evento.target.files[0];
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = () => {
        this.selectedImage = leitor.result as string;
        console.log('Imagem carregada: ', this.selectedImage);
      };
      leitor.readAsDataURL(arquivo);
    }
  }

  removerImagem() {
    if (this.selectedImage && this.selectedImage !== this.defaultImage) {
      this.selectedImage = null;
    }
  }

  enviarImagem() {
    const inputArquivo = document.getElementById('inputArquivo') as HTMLInputElement;
    inputArquivo.click();
  }
}
