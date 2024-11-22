import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { Router } from '@angular/router';
import { Storage } from '@ionic/storage-angular';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

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
  productPrice: string = '';
  userEmail: string | null = null;
  description: string = '';
  isModalOpen: boolean = false;

  // Imagem padrão (de exemplo)
  defaultImage: string = 'assets/images/logo_mercadindin.png';

  // Lista de mercados pré-definidos
  markets: string[] = [
    'Guanabara - Bonsucesso',
    'Guanabara - Penha',
    'Guanabara - Engenho da rainha',
    'Supermarket - Bonsucesso',
    'Supermarket - Maria da graça',
    'Supermarket - Pilares'
  ];

  // Lista de mercados filtrados (inicialmente igual à lista completa)
  filteredMarkets: string[] = [...this.markets];

  // Texto da barra de pesquisa
  searchText: string = '';

  constructor(
    private modalController: ModalController,
    private router: Router,
    private storage: Storage,
    private afAuth: AngularFireAuth
  ) {}

  ngOnInit() {
    // Obter o e-mail do usuário logado
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.userEmail = user.email;
      }
    });
  }

  // Função para abrir o modal de seleção de mercado
  openMarketSelectModal() {
    this.tempSelectedMarket = this.selectedMarket; // Armazena o valor temporário
    this.isModalOpen = true; // Abre o modal
  }

  // Função para fechar o modal
  closeModal() {
    this.isModalOpen = false; // Fecha o modal
  }

  // Função para confirmar a seleção do mercado
  confirmSelection(selectedMarket: string) {
    this.selectedMarket = selectedMarket; // Define o mercado selecionado
    this.isModalOpen = false; // Fecha o modal
  }

  // Função para filtrar os mercados conforme o texto da pesquisa
  filterMarkets() {
    this.filteredMarkets = this.markets.filter(market =>
      market.toLowerCase().includes(this.searchText.toLowerCase()) // Filtra com base no texto de pesquisa
    );
  }

  // Função para salvar o post
  async salvarPost() {
    if (!this.productTitle || !this.selectedMarket || !this.productPrice || !this.selectedImage || this.selectedImage === this.defaultImage) {
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
    };

    try {
      const storedProducts = (await this.storage.get('products')) || []; // Recupera os produtos existentes ou inicializa uma lista vazia
      storedProducts.push(newProduct); // Adiciona o novo produto
      await this.storage.set('products', storedProducts); // Salva os produtos atualizados no Storage
      console.log('Produto salvo com sucesso:', newProduct); // Log para depuração
      this.router.navigate(['/home']); // Navega para a página inicial
    } catch (error) {
      console.error('Erro ao salvar o post:', error);
    }
  }

  // Função para tirar foto
  async tirarFoto() {
    try {
      const photo = await Camera.getPhoto({
        quality: 90,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });
      this.selectedImage = photo.dataUrl || null; // Atualiza a imagem selecionada
    } catch (error) {
      console.error('Erro ao tirar foto:', error);
    }
  }

  // Função para selecionar a imagem do arquivo
  imagemSelecionada(evento: any) {
    const arquivo = evento.target.files[0]; // Obtém o arquivo da imagem
    if (arquivo) {
      const leitor = new FileReader();
      leitor.onload = () => {
        // Atualiza selectedImage com a imagem carregada
        this.selectedImage = leitor.result as string;
        console.log('Imagem carregada: ', this.selectedImage);  // Para depuração
      };
      leitor.readAsDataURL(arquivo); // Lê a imagem como URL de dados
    }
  }

  // Função para remover a imagem
  removerImagem() {
    this.selectedImage = null; // Limpa a imagem
  }

  // Função para abrir o seletor de arquivo de imagem
  enviarImagem() {
    const inputArquivo = document.getElementById('inputArquivo') as HTMLInputElement;
    inputArquivo.click();
  }
}
