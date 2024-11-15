import { Component, OnInit } from '@angular/core';
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
  selectedMarket: string = ''; // Mercado selecionado
  productPrice: string = '';
  userEmail: string | null = null;
  description: string = '';

  // Lista de mercados pré-definidos
  markets: string[] = [
    'Guanabara - Bonsucesso',
    'Guanabara - Penha',
    'Guanabara - Engenho da rainha',
    'Supermarket - Bonsucesso',
    'Supermarket - Maria da graça',
    'Supermarket - Pilares'
  ];

  constructor(
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

  async salvarPost() {
    if (!this.productTitle || !this.selectedMarket || !this.productPrice) {
      alert('Por favor, preencha todos os campos obrigatórios!');
      return;
    }
  
    const newProduct = {
      title: this.productTitle,
      subtitle: this.selectedMarket,
      price: this.productPrice,
      image: this.selectedImage || 'assets/images/default-image.png',
      email: this.userEmail,
      description: this.description,
    };
  
    // Inicializa o Storage antes de usar
    await this.storage.create();
  
    // Recupera os produtos existentes no Local Storage
    const storedProducts = (await this.storage.get('products')) || [];
    console.log('Produtos armazenados antes de adicionar:', storedProducts);
  
    // Adiciona o novo post
    storedProducts.push(newProduct);
  
    // Salva os produtos atualizados no Storage
    await this.storage.set('products', storedProducts);
    console.log('Produtos armazenados após adicionar:', storedProducts);
  
    // Redireciona para a Home
    alert('Post criado com sucesso!');
    this.router.navigate(['/home']);
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
      };
      leitor.readAsDataURL(arquivo);
    }
  }

  removerImagem() {
    this.selectedImage = null;
  }

  enviarImagem() {
    const inputArquivo = document.getElementById('inputArquivo') as HTMLInputElement;
    inputArquivo.click();
  }
}