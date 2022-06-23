import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Instituition } from '../models/Instituition/instituition.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class InstituitionService {

  instituitionRef: AngularFirestoreCollection<Instituition> = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.instituitionRef = this.db.collection<Instituition>('instituicao', ref => ref.orderBy('instituicao', 'asc'));
  }

  getAll(): AngularFirestoreCollection<Instituition> {
    return this.instituitionRef;
  }

  create(instituition: Instituition): any {
    return this.instituitionRef.add({ ...instituition });
  }

  update(id: string, data: any): Promise<void> {
    return this.instituitionRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.instituitionRef.doc(id).delete();
  }

}
