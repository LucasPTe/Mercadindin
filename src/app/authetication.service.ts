import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AutheticationService {

  constructor(private afAuth: AngularFireAuth) { }

  async registerUser(email: string, password: string) {
    return await this.afAuth.createUserWithEmailAndPassword(email, password);
  }

  async loginUser(email: string, password: string) {
    return await this.afAuth.signInWithEmailAndPassword(email, password);
  }

  logoutUser() {
    return this.afAuth.signOut();
  }

  // Método modificado para incluir o displayName
  userDetails(): Observable<any> {
    return new Observable(observer => {
      this.afAuth.authState.subscribe(user => {
        if (user) {
          observer.next({
            email: user.email,
            displayName: user.displayName || 'Nome não definido',
            photoURL: user.photoURL || 'assets/user-default.png', // Exemplo de foto padrão
          });
        } else {
          observer.next(null);
        }
      });
    });
  }
}
