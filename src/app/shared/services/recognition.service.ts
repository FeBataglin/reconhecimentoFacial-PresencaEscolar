import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Recognition } from './../models/recognition/recognition.model';
import { FormControl, FormGroup } from "@angular/forms";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { PresenceListService } from './presence-list.service';

@Injectable({
  providedIn: 'root'
})
export class RecognitionService {

  //recognitionRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  //studentRef: AngularFireObject<any>;
  recognition;

  private dbPath = '/lista_de_presenca';

  recognitionRef: AngularFirestoreCollection = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.recognitionRef = this.db.collection('lista_de_presenca');
  }

  create(id, responsible, discipline, datavalue, initialTime, finalTime) {
    this.recognitionRef.add({
      data: datavalue,
      id: id,
      presenca: "presente",
      responsavel: responsible,
      disciplina: discipline,
      horaInicio: initialTime,
      horaFim: finalTime
    })
  }

  createFalls(id, responsible, discipline, datavalue, initialTime, finalTime) {
    this.recognitionRef.add({
      data: datavalue,
      id: id,
      presenca: "falta",
      responsavel: responsible,
      disciplina: discipline,
      horaInicio: initialTime,
      horaFim: finalTime
    })
  }

  /*createFalls(id, responsible, discipline, datavalue) {
    this.recognitionRef.add({
      data: datavalue,
      id: id,
      presenca: "falta",
      responsavel: responsible,
      disciplina: discipline
    })
  }*/
}
