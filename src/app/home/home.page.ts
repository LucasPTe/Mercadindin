import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  isModalOpen = false;
  selectedProduct: any;  // Variável para armazenar o produto selecionado

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

  constructor() {}

  // Método que abre o modal e define o produto selecionado
  setOpen(isOpen: boolean, product?: any) {
    this.isModalOpen = isOpen;
    if (isOpen && product) {
      this.selectedProduct = product;
    }
  }
}