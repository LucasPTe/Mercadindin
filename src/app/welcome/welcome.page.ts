import { Component, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.page.html',
  styleUrls: ['./welcome.page.scss'],
})
export class WelcomePage implements AfterViewInit {
  constructor() {}

  ngAfterViewInit() {
    // Espera o tempo necessário antes de adicionar a classe de animação
    setTimeout(() => {
      const text = document.querySelector("#text") as HTMLElement;
      text.classList.add('bounceIn'); // Adiciona a classe bounceIn ao texto
    }, 100); // Delay opcional, para garantir que o DOM esteja pronto
  }
}
