import { Component } from '@angular/core';

@Component({
  selector: 'app-desenvolvedores',
  templateUrl: './desenvolvedores.page.html',
  styleUrls: ['./desenvolvedores.page.scss'],
})
export class DesenvolvedoresPage {
  developers = [
    {
      name: 'Kauã da Silva Bezerra',
      photo: 'assets/images/img_devs/Kaua.jpeg', // Substitua pelo caminho real da imagem
      instagramUsername: 'okaua_silva',
      githubUsername: 'KBezerra',
      linkedinUsername: 'Kauã Silva',

    },
    {
      name: 'Annibal Gulias',
      photo: 'assets/images/img_devs/annibal.jpeg', // Substitua pelo caminho real da imagem
      instagramUsername: '@annibal.gulias',
      githubUsername: 'annibal',
      linkedinUsername: 'Annibal Gulias'
    },
    {
      name: 'Lucas Roberto Lopes',
      photo: 'assets/images/img_devs/lucas.jpeg', // Substitua pelo caminho real da imagem
      instagramUsername: '@lucaslopes.dev',
      githubUsername: 'LucasPTe',
      linkedinUsername: 'Lucas Lopes'
    },
    {
      name: 'Caio Nery',
      photo: 'assets/images/img_devs/caio.jpg', // Substitua pelo caminho real da imagem
      instagramUsername: '@caio_n.r',
      githubUsername: 'caio',
      linkedinUsername: 'caio'
    }
  ];
}
