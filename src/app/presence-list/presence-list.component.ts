import { Component, HostListener, Inject, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoPageAction, PoTableColumn, PoTableColumnSort } from '@po-ui/ng-components'
import { StudentService } from '../shared/services/student.service';
import { PresenceListService } from './../shared/services/presence-list.service'
import { map } from 'rxjs/operators';
import { Recognition } from '../shared/models/recognition/recognition.model';
import { DOCUMENT } from '@angular/common';
import { RecognitionService } from '../shared/services/recognition.service';
import { Subject } from 'rxjs';
import * as firebase from 'firebase';
import { UserService } from '../shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';

@Component({
  selector: 'app-presence-list',
  templateUrl: './presence-list.component.html',
  styleUrls: ['./presence-list.component.css']
})
export class PresenceListComponent implements OnInit {
  date: Date = new Date();
  referenceDate;
  columnsPresenceList: Array<PoTableColumn>;
  itemsPresenceList: Array<any> = [];
  itemsPresence: Array<any> = [];
  public innerWidth: any;

  pageActionsPresenceList: Array<PoPageAction>;

  students: Array<any> = [];
  disciplineName: Array<String> = [];
  reload: boolean = true;
  falls: Array<any> = [];
  putFalls: Array<any> = [];
  itemsAux: Array<any> = [];
  disciplinesList: Array<any> = [];
  disciplineCheckbox: Array<any> = [];
  disciplines: Array<any> = [];
  itemsPresenceListGeneral: Array<any> = [];
  servicePresenceListResponse: Array<any> = [];
  notAdminFilteredList: Array<any> = [];

  data;
  responsible;
  discipline: Array<any> = [];
  presence;
  passed: boolean = false;
  passedGet: boolean = false;
  foundStudent: boolean;
  disciplineIndex;
  inputSearch;
  dataValue;
  isHideLoading = false;
  user;
  userEmail;
  admin;
  horaInicio;
  horaFim;

  docRef = this.db.collection("lista_de_presenca");

  getOptions = {
    source: 'cache'
  };

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de instituição' }]
  }

  constructor(
    @Inject(DOCUMENT) private _document: Document,
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private studentService: StudentService,
    private presenceListService: PresenceListService,
    private db: AngularFirestore,
    private recognitionService: RecognitionService,
    private userService: UserService,
    private afAuth: AngularFireAuth
  ) { }

  ngOnInit(): void {
    this.innerWidth = window.innerWidth;
    this.setupComponents();
    this.columnsPresenceList = this.presenceListService.getColumns();
    this.user = this.afAuth.authState;

    this.user.subscribe(
      (user) => {
        if (user) {
          this.userEmail = user;
          this.getUserAdmin(this.userEmail.email);
        } else {
          this.userEmail = null;
        }
      }
    );

    //this.getStudents();
    this.getFilters();
  }

  getUserAdmin(email) {
    this.userService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === email) {
          this.admin = data[i].admin;
          if (!this.admin) {
            this.getStudentsNotAdmin(data[i].email);
          } else {
            this.getStudentsAdmin();
          }
        }
      }
    });
  }


  changeDate(event) {
    this.referenceDate = event;
  }

  getStudentsAdmin() {
    this.studentService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.students.push(data[i]);
      }
    });
    this.getItemsAux();
  }

  getStudentsNotAdmin(email) {
    this.studentService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].email === email) {
          this.students.push(data[i]);
        }
      }
    });
    this.getItemsAux();
  }


  async getItemsAux() {
    let presencesRef = this.db.collection('lista_de_presenca');
    let query = presencesRef.get().toPromise()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          this.disciplineIndex = doc.data().disciplina;
          this.discipline.push(doc.data().disciplina);
          this.responsible = doc.data().responsavel;
          this.data = doc.data().data;
          this.horaInicio = doc.data().horaInicio;
          this.horaFim = doc.data().horaFim;
          this.itemsAux.push(doc.data())
        });

        var disciplineIndex = this.disciplineIndex;
        var discipline = this.discipline.filter((v, i, a) => a.findIndex(t => (t === v && t !== "" && t !== undefined)) === i);

        const unique = this.itemsAux.filter((v, i, a) => a.findIndex(t => (t.id === v.id && t.disciplina === v.disciplina && v.data === t.data && v.id !== "" && v.horaInicio === t.horaInicio)) === i)
        
        var c = this.students.filter(function (objFromA) {
          return !unique.find(function (objFromB) {
            return objFromA.id === objFromB.id;
          })
        })
        
        if (discipline.length === 1) {
          for (let i2 = 0; i2 < c.length; i2++) {
            this.putFalls.push({
              id: c[i2].id,
              disciplina: disciplineIndex,
              responsavel: this.responsible,
              presenca: 'falta',
              data: this.data,
              horaInicio: this.horaInicio ,
              horaFim: this.horaFim
            })
          }
        } else {
          for (let i1 = 0; i1 < discipline.length; i1++) {
            if (c.length === 0) {
              var c = this.students.filter(function (objFromA) {
                return !unique.find(function (objFromB) {
                  return objFromA.id === objFromB.id && objFromB.disciplina !== discipline[i1];
                })
              })
            }

            if (c.length === 0) {
              var c = this.students.filter(function (objFromA) {
                return !unique.find(function (objFromB) {
                  return objFromA.id === objFromB.id && objFromB.disciplina === discipline[i1];
                })
              })
            }

            for (let i2 = 0; i2 < c.length; i2++) {
              this.putFalls.push({
                id: c[i2].id,
                disciplina: discipline[i1],
                responsavel: this.responsible,
                presenca: 'falta',
                data: this.data,
                horaInicio: this.horaInicio ,
                horaFim: this.horaFim
              })
            }
          }
        }

        for (let i2 = 0; i2 < this.putFalls.length; i2++) {
          this.recognitionService.createFalls(this.putFalls[i2].id, this.putFalls[i2].responsavel, this.putFalls[i2].disciplina, this.putFalls[i2].data, this.putFalls[i2].horaInicio, this.putFalls[i2].horaFim)
        }

        //this.getItems();
        this.isHideLoading = false;
        setTimeout(() => {
          this.onClearFilters();
          this.getFilters();
          this.isHideLoading = true;
        }, 5000);
      })
      .catch(err => {
        console.log('Error getting documents', err);
      });
  }

  getFilters() {
    this.disciplinesList = [];
    this.disciplineCheckbox = [];

    return this.presenceListService.getItemsByName().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      this.itemsPresenceListGeneral = [];
      this.servicePresenceListResponse = []
   
      const unique = data.filter((v, i, a) => a.findIndex(t => (t.disciplina === v.disciplina)) === i)
      const uniqueAux = data.filter((v, i, a) => a.findIndex(t => (t.id === v.id && t.disciplina === v.disciplina && v.data === t.data && v.id !== "" && v.horaInicio === t.horaInicio)) === i);
     
      this.itemsPresenceListGeneral = uniqueAux;
      this.servicePresenceListResponse = uniqueAux;

      for (let index = 0; index < unique.length; index++) {
        this.disciplinesList.push({
          name: unique[index].disciplina,
          value: unique[index].disciplina
        })

        this.disciplineCheckbox.push({
          name: unique[index].disciplina,
          value: unique[index].disciplina,
          selected: false
        });

        this.disciplines.push(unique[index].disciplina);
      }
    });
  }

  onInput(event) {
    this.dataValue = event.target.value;
  }

  onSearch(event) {
    this.onApplyFilters();
  }

  onApplyFilters() {
    this.disciplineName = [];

    const filteredDisciplines = [];

    let filteredPresenceList = [];
    this.itemsPresenceList = [];
    this.notAdminFilteredList = [];

    this.disciplineCheckbox.forEach(disciplines => {
      if (disciplines.selected) {
        filteredDisciplines.push(disciplines.value);
      }
    });

    filteredPresenceList = this.servicePresenceListResponse;

    if (filteredDisciplines.length > 0) {
      filteredPresenceList = filteredPresenceList.filter(compromise => filteredDisciplines.indexOf(compromise.disciplina.toString()) !== -1);
    }

    if (this.inputSearch && this.inputSearch !== '') {
      var date = this.inputSearch.substring(8, 10) + "/" + this.inputSearch.substring(5, 7) + "/" + this.inputSearch.substring(0, 4);

      // tslint:disable-next-line: max-line-length
      filteredPresenceList = filteredPresenceList.filter(f => date === f.data);
    }

    this.itemsPresenceListGeneral = filteredPresenceList;

    for (let i3 = 0; i3 < this.itemsPresenceListGeneral.length; i3++) {
      for (let i4 = 0; i4 < this.students.length; i4++) {
        if (this.students[i4].id === this.itemsPresenceListGeneral[i3].id) {
          this.itemsPresenceListGeneral[i3].id = this.students[i4].nome;
        }
      }
    }

    if (!this.admin) {
      for (let i1 = 0; i1 < this.itemsPresenceListGeneral.length; i1++) {
        for (let i2 = 0; i2 < this.students.length; i2++) {
          if (this.itemsPresenceListGeneral[i1].id === this.students[i2].nome) {
            this.notAdminFilteredList.push(this.itemsPresenceListGeneral[i1])
          } 
        }
      }
      this.itemsPresenceListGeneral = this.notAdminFilteredList;
    }
    
    const disciplines = this.groupBy(this.itemsPresenceListGeneral, 'disciplina');

    Object.keys(disciplines).forEach((key: any) => {
      this.itemsPresenceList.push(disciplines[key]);
    });

    for (let index = 0; index < this.itemsPresenceList.length; index++) {
      this.disciplineName.push(this.itemsPresenceList[index][0].disciplina)
    }

  }

  onClearFilters() {

    this.disciplinesList.forEach(disciplines => disciplines.selected = false);
    this.disciplineCheckbox.forEach(disciplines => disciplines.selected = false);

    this.inputSearch = '';

    this.onApplyFilters();
  }

  changeDisciplines(disciplines) {
    this.disciplineCheckbox.find(x => x.value === disciplines.value).selected = disciplines.selected;
    this.onApplyFilters();
  }

  getItems() {
    if (this.admin) {
      this.itemsPresenceList = [];
      return this.presenceListService.getItems().snapshotChanges().pipe(
        map(changes =>
          changes.map(c =>
            ({ id: c.payload.doc.id, ...c.payload.doc.data() })
          )
        )
      ).subscribe(data => {

        const unique = data.filter((v, i, a) => a.findIndex(t => (t.id === v.id && t.disciplina === v.disciplina && v.data === t.data && v.id !== "")) === i)

        const discipline = this.groupBy(unique, 'disciplina');

        Object.keys(discipline).forEach((key: any) => {
          this.itemsPresenceList.push(discipline[key])
        })
        for (let i2 = 0; i2 < this.itemsPresenceList.length; i2++) {
          for (let i3 = 0; i3 < this.itemsPresenceList[i2].length; i3++) {

            this.responsible = this.itemsPresenceList[i2][i3].responsavel;
            this.discipline = this.itemsPresenceList[i2][i3].disciplina;
            this.data = this.itemsPresenceList[i2][i3].data;

            for (let i4 = 0; i4 < this.students.length; i4++) {
              if (this.itemsPresenceList[i2][i3].id === "") {
                this.itemsPresenceList[i2].slice(this.itemsPresenceList[i2][i3], 1);
              }
              if
                (this.students[i4].id === this.itemsPresenceList[i2][i3].id) {
                this.itemsPresenceList[i2][i3].id = this.students[i4].nome;
              }
            }
          }
          for (let index = 0; index < this.itemsPresenceList.length; index++) {
            this.disciplineName.push(this.itemsPresenceList[index][0].disciplina)
          }
        }
        //this.changeID();
      });
    } else {
      console.log("oi")
    }
  }

  changeID() {
    for (let i2 = 0; i2 < this.itemsPresenceList.length; i2++) {
      for (let i3 = 0; i3 < this.itemsPresenceList[i2].length; i3++) {
        for (let i4 = 0; i4 < this.students.length; i4++) {
          if (this.students[i4].id === this.itemsPresenceList[i2][i3].id) {
            this.itemsPresenceList[i2][i3].id = this.students[i4].nome;
          }
        }
      }
    }
  }

  groupBy(discipline, codAluno) {
    return discipline.reduce(function (memo, x) {
      if (!memo[x[codAluno]]) { memo[x[codAluno]] = []; }
      memo[x[codAluno]].push(x);
      return memo;
    }, {});
  }

  changeDateOnInput(event) {
    this.referenceDate = event.target.value;
  }

  setupComponents(): void {
    this.pageActionsPresenceList = [
      {
        label: "Cancelar"
        //action: () => this.router.navigate(['compromise/new']),
      },
      {
        label: "Salvar"
      }
    ];
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    this.poDialog.confirm({
      title: `Confirm redirect to ${itemBreadcrumbLabel}`,
      message: `There is data that has not been saved yet. Are you sure you want to quit?`,
      confirm: () => this.route.navigate(['/'])
    });
  }
}
