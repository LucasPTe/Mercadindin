import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  userName: string = 'Bilibli'; // Nome do usuário
  userPhoto: string = 'assets/user-default.png'; // Foto do usuário

  constructor(private router: Router) {}

  editProfile() {
    this.router.navigate(['/edit-profile']);
  }

  logoutUser() {
    console.log('Usuário deslogado');
  }
}
