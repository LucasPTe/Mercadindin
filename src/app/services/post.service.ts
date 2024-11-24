import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PostService {
  private collectionName = 'posts'; // Nome da coleção no Firestore

  constructor(private afs: AngularFirestore) {}

  async addPost(post: any): Promise<void> {
    try {
      await this.afs.collection(this.collectionName).add(post);
      console.log('Post salvo com sucesso:', post);
    } catch (error) {
      console.error('Erro ao salvar post:', error);
      throw error;
    }
  }

  getPosts(): Observable<any[]> {
    return this.afs.collection(this.collectionName, ref => ref.orderBy('createdAt', 'desc')).valueChanges({ idField: 'id' });
  }
}
