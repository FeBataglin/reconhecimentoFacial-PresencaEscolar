import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { PoDialogService, PoNotificationService, PoRadioGroupOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { ManualPresenceService } from '../shared/services/manual-presence.service';
import { PresenceListService } from '../shared/services/presence-list.service';
import { StudentService } from '../shared/services/student.service';

@Component({
  selector: 'app-manual-presence',
  templateUrl: './manual-presence.component.html',
  styleUrls: ['./manual-presence.component.css']
})
export class ManualPresenceComponent implements OnInit {

  date;
  moreDatas: boolean;
  referenceDate;
  saveButton;
  falta;
  presente;
  faltaJustificada;
  faltaAbonada;
  dataValue;
  inputSearch;
  isHideLoading = true;
  callClean: boolean = false;
  studentName;
  valid: boolean = true;
  students: Array<any> = [];
  itemsPresenceList: Array<any> = [];
  itemsPresenceListEdit: Array<any> = [];
  itemsPresenceListEditAux: Array<any> = [];
  disciplinesList: Array<any> = [];
  disciplineCheckbox: Array<any> = [];
  list: Array<any> = [];
  disciplines: Array<any> = [];
  itemsPresenceListGeneral: Array<any> = [];
  servicePresenceListResponse: Array<any> = [];
  checkboxDataList: Array<any> = [];

  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private studentService: StudentService,
    private presenceListService: PresenceListService,
    private db: AngularFirestore
  ) { }

  ngOnInit(): void {
    this.saveButton = new FormControl;
    this.getStudents();
    this.date = new Date().toLocaleDateString();
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
        this.students.push(data[i]);
      }
    });

    this.getFilters();
  }

  onInput(event) {
    this.dataValue = event.target.value;
  }

  onSearch(event) {
    this.onApplyFilters();
  }

  onInputByName(event) {
    this.studentName = event.target.value;
    this.onApplyFilters();
  }

  onSearchByName(event) {
    this.onApplyFilters();
  }

  onApplyFilters() {
    this.date = new Date().toLocaleDateString();

    const filteredDisciplines = [];

    let filteredPresenceList = [];
    this.itemsPresenceList = [];

    this.disciplineCheckbox.forEach(disciplines => {
      if (disciplines.selected) {
        filteredDisciplines.push(disciplines.value);
      }
    });

    filteredPresenceList = this.servicePresenceListResponse;

    if (filteredDisciplines.length > 0) {
      filteredPresenceList = filteredPresenceList.filter(compromise => filteredDisciplines.indexOf(compromise.disciplina.toString()) !== -1);
      //filteredPresenceList = filteredPresenceList.filter(f => filteredDisciplines.some(item => item === f.disciplina));
    }

    if (this.inputSearch && this.inputSearch !== '') {
      var date = this.inputSearch.substring(8, 10) + "/" + this.inputSearch.substring(5, 7) + "/" + this.inputSearch.substring(0, 4);
      this.date = date;
      // tslint:disable-next-line: max-line-length
      filteredPresenceList = filteredPresenceList.filter(f => date === f.data);
    }

    for (let index = 0; index < filteredPresenceList.length; index++) {
      if (filteredPresenceList[index].presenca === "presente") {
        this.itemsPresenceList.push({
          nome: filteredPresenceList[index].id,
          id: filteredPresenceList[index].id,
          responsavel: filteredPresenceList[index].responsavel,
          disciplina: filteredPresenceList[index].disciplina,
          data: filteredPresenceList[index].data,
          presente: true,
          falta: false,
          faltaJustificada: false,
          faltaAbonada: false
        })
      } else if (filteredPresenceList[index].presenca === "falta") {
        this.itemsPresenceList.push({
          nome: filteredPresenceList[index].id,
          id: filteredPresenceList[index].id,
          responsavel: filteredPresenceList[index].responsavel,
          disciplina: filteredPresenceList[index].disciplina,
          data: filteredPresenceList[index].data,
          presente: false,
          falta: true,
          faltaJustificada: false,
          faltaAbonada: false
        })
      } else if (filteredPresenceList[index].presenca === "faltaJustificada") {
        this.itemsPresenceList.push({
          nome: filteredPresenceList[index].id,
          id: filteredPresenceList[index].id,
          responsavel: filteredPresenceList[index].responsavel,
          disciplina: filteredPresenceList[index].disciplina,
          data: filteredPresenceList[index].data,
          presente: false,
          falta: false,
          faltaJustificada: true,
          faltaAbonada: false
        })
      } else if (filteredPresenceList[index].presenca === "faltaAbonada") {
        this.itemsPresenceList.push({
          nome: filteredPresenceList[index].id,
          id: filteredPresenceList[index].id,
          responsavel: filteredPresenceList[index].responsavel,
          disciplina: filteredPresenceList[index].disciplina,
          data: filteredPresenceList[index].data,
          presente: false,
          falta: false,
          faltaJustificada: false,
          faltaAbonada: true
        })
      }
    }

    for (let i3 = 0; i3 < this.itemsPresenceList.length; i3++) {
      for (let i4 = 0; i4 < this.students.length; i4++) {
        if (this.students[i4].id === this.itemsPresenceList[i3].nome) {
          this.itemsPresenceList[i3].nome = this.students[i4].nome;
        }
      }
    }

    const itemsList = this.itemsPresenceList.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0));
    this.itemsPresenceList = itemsList;

    if (this.studentName && this.studentName !== '') {
      this.itemsPresenceList = this.itemsPresenceList.filter(student => student.nome.toUpperCase().indexOf(this.studentName.toUpperCase()) !== -1);
    }

  }

  onSave(item) {
    this.itemsPresenceList = [];
    this.disciplinesList = [];

    for (let index = 0; index < item.length; index++) {
      if (item[index].presenceControl === "1") {
        this.itemsPresenceListEdit.push({
          id: item[index].id,
          responsavel: item[index].responsavel,
          disciplina: item[index].disciplina,
          data: item[index].data,
          presenca: "presente",
        })
      } else if (item[index].presenceControl === "2") {
        this.itemsPresenceListEdit.push({
          id: item[index].id,
          responsavel: item[index].responsavel,
          disciplina: item[index].disciplina,
          data: item[index].data,
          presenca: "falta",
        })
      } else if (item[index].presenceControl === "3") {
        this.itemsPresenceListEdit.push({
          id: item[index].id,
          responsavel: item[index].responsavel,
          disciplina: item[index].disciplina,
          data: item[index].data,
          presenca: "faltaJustificada",
        })
      } else if (item[index].presenceControl === "4") {
        this.itemsPresenceListEdit.push({
          id: item[index].id,
          responsavel: item[index].responsavel,
          disciplina: item[index].disciplina,
          data: item[index].data,
          presenca: "faltaAbonada",
        })
      }
    }

    let presencesRef = this.db.collection('lista_de_presenca');
    let query = presencesRef.get().toPromise()
      .then(snapshot => {
        if (snapshot.empty) {
          console.log('No matching documents.');
          return;
        }

        snapshot.forEach(doc => {
          this.itemsPresenceListEditAux.push({
            collectionID: doc.id,
            id: doc.data().id,
            disciplina: doc.data().disciplina,
            data: doc.data().data,
            presenca: doc.data().presenca,
            responsavel: doc.data().responsavel
          })
        });

        const unique = this.itemsPresenceListEditAux.filter((v, i, a) => a.findIndex(t => (t.id === v.id && t.disciplina === v.disciplina && v.data === t.data && v.id !== "")) === i);

        for (let i1 = 0; i1 < unique.length; i1++) {
          for (let i2 = 0; i2 < this.itemsPresenceListEdit.length; i2++) {
            if (unique[i1].id === this.itemsPresenceListEdit[i2].id &&
              unique[i1].disciplina === this.itemsPresenceListEdit[i2].disciplina &&
              unique[i1].data === this.itemsPresenceListEdit[i2].data) {
              this.db.collection("lista_de_presenca").doc(unique[i1].collectionID).update(this.itemsPresenceListEdit[i2]);
            }
          }
        }

        this.poNotification.success("As frequências alteradas foram salvas.");
        this.isHideLoading = false;
        setTimeout(() => {
          this.onClearFilters();
          this.isHideLoading = true;
        }, 4000);
      })
      .catch(err => {
        this.poNotification.error("Erro ao salvar.")
      });
  }

  onClearFilters() {
    this.disciplinesList.forEach(disciplines => disciplines.selected = false);
    this.disciplineCheckbox.forEach(disciplines => disciplines.selected = false);

    this.inputSearch = '';
    this.studentName = '';

    this.onApplyFilters();
    this.getFilters();
  }

  onChange(obj) {
    console.log(obj)
  }

  changeDisciplines(disciplines) {
    this.disciplineCheckbox.find(x => x.value === disciplines.value).selected = disciplines.selected;
    this.onApplyFilters();
  }

  getFilters() {
    this.date = "";

    this.itemsPresenceList = [];
    this.disciplinesList = [];
    this.disciplineCheckbox = [];

    return this.presenceListService.getItemsByName().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      var date = new Date().toLocaleDateString();
      this.date = date;

      this.itemsPresenceListGeneral = [];
      this.servicePresenceListResponse = []

      const unique = data.filter((v, i, a) => a.findIndex(t => (t.disciplina === v.disciplina)) === i)
      const uniqueAux = data.filter((v, i, a) => a.findIndex(t => (t.id === v.id && t.disciplina === v.disciplina && v.data === t.data && v.id !== "")) === i);

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

      for (let index = 0; index < uniqueAux.length; index++) {
        if (uniqueAux[index].data === date) {
          if (uniqueAux[index].presenca === "presente") {
            this.itemsPresenceList.push({
              nome: uniqueAux[index].id,
              id: uniqueAux[index].id,
              responsavel: uniqueAux[index].responsavel,
              disciplina: uniqueAux[index].disciplina,
              data: uniqueAux[index].data,
              presenceControl: '1',
            })
          } else if (uniqueAux[index].presenca === "falta") {
            this.itemsPresenceList.push({
              nome: uniqueAux[index].id,
              id: uniqueAux[index].id,
              responsavel: uniqueAux[index].responsavel,
              disciplina: uniqueAux[index].disciplina,
              data: uniqueAux[index].data,
              presenceControl: '2',
            })
          } else if (uniqueAux[index].presenca === "faltaJustificada") {
            this.itemsPresenceList.push({
              nome: uniqueAux[index].id,
              id: uniqueAux[index].id,
              responsavel: uniqueAux[index].responsavel,
              disciplina: uniqueAux[index].disciplina,
              data: uniqueAux[index].data,
              presenceControl: '3',
            })
          } else if (uniqueAux[index].presenca === "faltaAbonada") {
            this.itemsPresenceList.push({
              nome: uniqueAux[index].id,
              id: uniqueAux[index].id,
              responsavel: uniqueAux[index].responsavel,
              disciplina: uniqueAux[index].disciplina,
              data: uniqueAux[index].data,
              presenceControl: '4',
            })
          }
        } 
        if (uniqueAux[index].data !== date ) {
          if (this.valid === true) {
            this.valid = false;
            this.poNotification.warning(`Nenhuma presença foi identificada para o dia ${date}.`)
          }
        }
      }

      for (let i3 = 0; i3 < this.itemsPresenceList.length; i3++) {
        for (let i4 = 0; i4 < this.students.length; i4++) {
          if (this.students[i4].id === this.itemsPresenceList[i3].nome) {
            this.itemsPresenceList[i3].nome = this.students[i4].nome;
          }
        }
      }

      const itemsList = this.itemsPresenceList.sort((a, b) => (a.nome > b.nome) ? 1 : ((b.nome > a.nome) ? -1 : 0));
      this.itemsPresenceList = itemsList;
      
    });
  }
}
