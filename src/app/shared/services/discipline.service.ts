import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Discipline } from '../models/disciplines/discipline.model';
import { FormControl, FormGroup } from "@angular/forms";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class DisciplineService {

  disciplinesRef: AngularFireList<any>;    // Reference to Student data list, its an Observable

  disciplines;

  disciplineRef: AngularFirestoreCollection<Discipline> = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.disciplineRef = this.db.collection<Discipline>('disciplina', ref => ref.orderBy('nome', 'asc'));
  }

  getAll(): AngularFirestoreCollection<Discipline> {
    return this.disciplineRef;
  }

  create(disciplines: Discipline): any {
    return this.disciplineRef.add({ ...disciplines });
  }

  update(id: string, data: any): Promise<void> {
    return this.disciplineRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.disciplineRef.doc(id).delete();
  }

}
