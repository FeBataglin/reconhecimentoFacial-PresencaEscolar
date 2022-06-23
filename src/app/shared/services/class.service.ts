import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Class } from '../models/classes/class.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ClassService {

  classRef: AngularFirestoreCollection<Class> = null;
  classRefId: AngularFirestoreDocument<any> = null;

  constructor(private db: AngularFirestore) {
    this.classRef = this.db.collection<Class>('turma', ref => ref.orderBy('nome', 'asc'));
  }

  getAll(): AngularFirestoreCollection<Class> {
    return this.classRef;
  }

  create(disciplines: Class): any {
    return this.classRef.add({ ...disciplines });
  }

  update(id: string, data: any): Promise<void> {
    console.log(id)
    return this.classRef.doc(id).update(data);
  }

  delete(id: string) {
    this.classRef.doc(id).delete();
  }

}
