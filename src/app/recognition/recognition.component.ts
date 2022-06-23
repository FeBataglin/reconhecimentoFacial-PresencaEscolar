import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { PoNotificationService } from '@po-ui/ng-components';
import * as firebase from 'firebase';
import { map } from 'rxjs/operators';
import { DisciplineService } from '../shared/services/discipline.service';
import { PresenceListService } from '../shared/services/presence-list.service';
import { RecognitionService } from '../shared/services/recognition.service';
import { StudentService } from '../shared/services/student.service';

declare const recognition: any;

@Component({
  selector: 'app-recognition',
  templateUrl: './recognition.component.html',
  styleUrls: ['./recognition.component.css']
})

export class RecognitionComponent implements OnInit {
  @ViewChild('alunos') alunos: ElementRef;
  @ViewChild('responsavel') responsavel: ElementRef;
  @ViewChild('disciplina') disciplina: ElementRef;

  students: Array<any> = [];
  discipline: Array<any> = [];
  yourfile: File;
  base64Image;
  currentTime;
  currentTimeAux: any;
  sumCaptures;
  initialTime;
  finalTime;
  responsible;
  disciplineName;
  cont = 0;
  presenceMarker: boolean;
  capturas;

  studentsInput: string;
  responsibleInput: string;
  disciplineNameInput: string;
  emailInput: string;

  studentsList: Array<any> = [];
  itemsPresence: Array<any> = [];
  foundStudent: boolean;

  studentsRecog: Array<any> = [];

  constructor(
    public firebase: AngularFireStorage,
    private studentService: StudentService,
    private disciplineService: DisciplineService,
    private presenceListService: PresenceListService,
    private recognitionService: RecognitionService,
    private db: AngularFirestore,
    private poNotification: PoNotificationService) { }

  ngOnInit(): void {
    this.getStudents();
    this.attTime();
    this.getDisciplines();
    this.getItems();
  }

  ngOnDestroy(): void {
    window.location.reload();
  }

  getStudents() {
    this.studentService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.students.push(data[i].id);
      }
    });
  }

  getItems() {
    this.presenceListService.getItems().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let index = 0; index < data.length; index++) {
        this.itemsPresence.push({
          id: data[index].id,
          date: data[index].data,
          discipline: data[index].disciplina,
          horaInicio: data[index].horaInicio,
          horaFim: data[index].horaFim
        })
      }
    });
  }

  getDisciplines() {
    this.disciplineService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.discipline.push(data[i]);
      }
      this.disciplineIdentify();
    });

  }

  disciplineIdentify() {
    for (let i = 0; i < this.discipline.length; i++) {
      if (this.discipline[i].horaInicio <= this.currentTime
        && this.discipline[i].horaFim >= this.currentTime - 1) {
        this.sumCaptures = this.discipline[i].cargaHoraria / this.discipline[i].qntdImagens * 60000;
        this.initialTime = this.discipline[i].horaInicio;
        this.finalTime = this.discipline[i].horaFim;

        var date = new Date();
        var HH = date.getHours();
        var mm = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();
        this.cont = this.cont + 1;
        var currentHour = `${HH}${mm}`;
        this.capturas = this.discipline[i].qntdPresenca;
        this.currentTime = parseInt(currentHour);

        this.responsible = this.discipline[i].responsavel;
        this.disciplineName = this.discipline[i].nome;

        this.callRecognition(this.initialTime, this.finalTime, this.currentTime, this.responsible, this.disciplineName);
      }
    }
  }

  callRecognition(initialTime, finalTime, currentTime, responsible, disciplineName) {
    var date = new Date();
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();

    var today = dd + '/' + mm + '/' + yyyy;

    if (this.cont === this.capturas) {
      this.presenceMarker = true;
    }

    if (initialTime <= currentTime && finalTime >= currentTime - 1) {
      recognition(responsible, disciplineName, this.students, today, initialTime, finalTime);
    } else {
      window.setInterval(() => this.disciplineIdentify(), 20000);
    }
  }

  public attTime() {
    var date = new Date();
    var HH = date.getHours();
    var mm = (date.getMinutes() < 10 ? '0' : '') + date.getMinutes();

    var currentHour = `${HH}${mm}`;

    this.currentTime = parseInt(currentHour);
  }

  getValues() {

    var studentValue = (<HTMLInputElement>document.getElementById("alunos")).value;
    var responsibleValue = (<HTMLInputElement>document.getElementById("responsavel")).value;
    var disciplineValue = (<HTMLInputElement>document.getElementById("disciplina")).value;
    var initialTimeValue = (<HTMLInputElement>document.getElementById("horaInicio")).value;
    var finalTimeValue = (<HTMLInputElement>document.getElementById("horaFim")).value;
    var dataValue = (<HTMLInputElement>document.getElementById("data")).value;

    initialTimeValue = `${initialTimeValue.substring(0,2)}:${initialTimeValue.substring(2,4)}`;
    finalTimeValue = `${finalTimeValue.substring(0,2)}:${finalTimeValue.substring(2,4)}`;

    let studentValueList = studentValue.split(",");

    for (let index = 0; index < studentValueList.length; index++) {
      const findStudent = this.itemsPresence.find(x => {
        if (x.id === studentValueList[index] && x.date === dataValue) {
          if (x.discipline !== disciplineValue || x.horaInicio !== initialTimeValue) {
            this.foundStudent = false;
          } else {
            this.foundStudent = true;
            return x;
          }
        } else {
          this.foundStudent = false;
        };
      })

      if (findStudent === undefined && !this.foundStudent) {
        this.recognitionService.create(studentValueList[index], responsibleValue, disciplineValue, dataValue, initialTimeValue, finalTimeValue)
      }
    }
  }
}