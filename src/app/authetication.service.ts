import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';

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

  userDetails() {
    return this.afAuth.user;
  }
}
