import { Component, OnInit } from '@angular/core';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera'; // Certifique-se de importar CameraSource

@Component({
  selector: 'app-post',
  templateUrl: './post.page.html',
  styleUrls: ['./post.page.scss'],
})
export class PostPage implements OnInit {
  selectedImage: string | ArrayBuffer | null = null; // Propriedade para armazenar a imagem selecionada

  constructor() {}

  ngOnInit() {}

  // Função para simular o clique no input de arquivo
  enviarImagem() {
    const inputArquivo = document.getElementById('inputArquivo') as HTMLInputElement;
    inputArquivo.click(); // Simula o clique no input para selecionar arquivo
  }

  // Função chamada quando uma imagem é selecionada
  imagemSelecionada(evento: any) {
    const arquivo = evento.target.files[0]; // Obtém o arquivo selecionado
    if (arquivo) {
      const leitor = new FileReader(); // Utiliza FileReader para ler o conteúdo do arquivo
      leitor.onload = () => {
        this.selectedImage = leitor.result; // Armazena a imagem carregada como base64
      };
      leitor.readAsDataURL(arquivo); // Converte a imagem para URL base64
    }
  }

  // Função para remover a imagem selecionada
  removerImagem() {
    this.selectedImage = null; // Limpa a imagem selecionada
  }

  // Função para tirar foto com a câmera
  async tirarFoto() {
    const photo = await Camera.getPhoto({
      quality: 90,
      resultType: CameraResultType.DataUrl, // Obtém a imagem como Data URL
      source: CameraSource.Camera // Usando o tipo correto em vez de uma string
    });
  
    // Verifica se photo.dataUrl não é undefined
    if (photo.dataUrl) {
      this.selectedImage = photo.dataUrl; // Atribui o Data URL à selectedImage
    } else {
      this.selectedImage = null; // Se for undefined, atribui null
    }
  }
}
