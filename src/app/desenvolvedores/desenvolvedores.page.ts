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
      photo: 'assets/annibal.jpg', // Substitua pelo caminho real da imagem
      instagramUsername: '@annibal',
      githubUsername: 'annibal',
      linkedinUsername: 'annibal'
    },
    {
      name: 'Lucas Roberto Lopes',
      photo: 'assets/lucas.jpg', // Substitua pelo caminho real da imagem
      instagramUsername: '@lucas',
      githubUsername: 'lucas',
      linkedinUsername: 'lucas'
    },
    {
      name: 'Caio Nery',
      photo: 'assets/caio.jpg', // Substitua pelo caminho real da imagem
      instagramUsername: '@caio',
      githubUsername: 'caio',
      linkedinUsername: 'caio'
    }
  ];
}
