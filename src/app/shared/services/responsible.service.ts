import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Responsible } from './../models/responsible/responsible.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class ResponsibleService {

  responsibleRef: AngularFirestoreCollection<Responsible> = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.responsibleRef = this.db.collection<Responsible>('responsavel', ref => ref.orderBy('nome', 'asc'));
  }

  getAll(): AngularFirestoreCollection<Responsible> {
    return this.responsibleRef;
  }

  create(disciplines: Responsible): any {
    return this.responsibleRef.add({ ...disciplines });
  }

  update(id: string, data: any): Promise<void> {
    return this.responsibleRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.responsibleRef.doc(id).delete();
  }

}
