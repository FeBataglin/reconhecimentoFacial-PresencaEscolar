import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { StudentService } from './../../shared/services/student.service';
import { AngularFireStorage } from "@angular/fire/storage"
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { map } from 'rxjs/operators';
import { DisciplineService } from 'src/app/shared/services/discipline.service';
import { ClassService } from 'src/app/shared/services/class.service';
import { InstituitionService } from 'src/app/shared/services/instituition.service';
import { CourseService } from 'src/app/shared/services/course.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-students',
  templateUrl: './students.component.html',
  styleUrls: ['./students.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class StudentsComponent implements OnInit {
  student: any;
  studentForm: FormGroup;
  userForm: FormGroup;
  time;
  user;

  path: Array<any> = [];
  urls: Array<any> = [];
  fileLenght;
  archiveName: Array<any[]>;

  disciplines: Array<any> = [];
  courses: Array<any> = [];
  class: Array<any> = [];
  instituitions: Array<any> = [];

  itemsStudentsList: Array<any> = [];
  columnsStudentsList: Array<any> = [];
  delete;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de Alunos' }]
  }

  opcoesInstituicao: Array<PoSelectOption> = [];

  opcoesDisciplina: Array<PoSelectOption> = [];

  opcoesTurma: Array<PoSelectOption> = [];

  opcoesCurso: Array<PoSelectOption> = [];

  @ViewChild('formEditStudents', { static: true }) formEditStudents: NgForm;
  @ViewChild('files') files: ElementRef;

  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;

  primaryAction: PoModalAction = {
    action: () => {
      this.modal.close();
    },
    label: 'Fechar'
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.studentsService.delete(this.delete);
      this.getStudentsByName();
      this.modal.close();
      this.poNotification.success(`O aluno foi deletado com sucesso.`)
    },
    label: 'Confirmar'
  };

  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private studentService: StudentService,
    private db: AngularFirestore,
    private formBuilder: FormBuilder,
    private af: AngularFireStorage,
    private courseService: CourseService,
    private instituitionService: InstituitionService,
    private classService: ClassService,
    private disciplineService: DisciplineService,
    private studentsService: StudentService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    public appComponent: AppComponent
  ) {
    this.createStudentForm();
    this.createUserForm();
  }

  ngOnInit(): void {
    this.getInstituitions();
    this.getDisciplines();
    this.getClass();
    this.getCourses();
    this.columnsStudentsList = this.getColumns();
    this.getStudentsByName();
  }

  cancel() {
  }

  upload($event) {

    this.urls = [];
    this.path = [];

    let files = $event.target.files;

    if (files) {
      for (let file of files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.urls.push(e.target.result);
        }
        reader.readAsDataURL(file);
      }
    }

    for (let index = 0; index < $event.target.files.length; index++) {
      this.path.push($event.target.files[index]);
    }

    this.fileLenght = $event.target.files.length;
  }

  removeSelectedFile(indexDelete) {
    this.urls.splice(indexDelete, 1);

    this.path.splice(indexDelete, 1)
  }

  createStudentForm() {
    this.studentForm = this.formBuilder.group({
      nome: ['', Validators.required],
      matricula: [Validators.required],
      email: ['', Validators.required],
      instituicao: [null, [Validators.required]],
      curso: [null, [Validators.required]],
      turma: [null, [Validators.required]],
      disciplina: [null, [Validators.required]],
      admin: false,
      time: this.getTime(),
      acoes: [["editar", "excluir"]]
    });
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      email: [''],
      password: [''],
      admin: false,
      nome: [''],
      identificacao: [null]
    });
  }

  resetForm() {
    this.studentForm.reset();
    this.userForm.reset();
    this.files.nativeElement.value = "";
    this.urls = [];
    this.createStudentForm();
    this.createUserForm();
  }

  getTime() {
    this.time = new Date().toLocaleString();
    return this.time;
  }

  getInstituitions() {
    this.instituitionService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.instituitions.push({
          value: data[i].instituicao,
          label: data[i].instituicao
        })
      }
      this.opcoesInstituicao = this.instituitions;
    });
  }

  getCourses() {
    this.courseService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.courses.push({
          value: data[i].nome,
          label: data[i].nome
        })
      }
      this.opcoesCurso = this.courses;
    });
  }


  getClass() {
    this.classService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.class.push({
          value: data[i].nome,
          label: data[i].nome
        })
      }
      this.opcoesTurma = this.class;
    });
  }

  getDisciplines() {
    this.disciplineService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.disciplines.push({
          value: data[i].nome,
          label: data[i].nome
        })
      }
      this.opcoesDisciplina = this.disciplines;
    });
  }

  registerStudent() {
    if (this.studentForm.valid) {

      this.userForm.value['email'] = this.studentForm.value['email'];
      this.userForm.value['password'] = `${this.studentForm.value['matricula']}@senai`;
      this.userForm.value['admin'] = this.studentForm.value['admin'];
      this.userForm.value['nome'] = this.studentForm.value['nome'];
      this.userForm.value['identificacao'] = this.studentForm.value['matricula'];

      var email = this.userForm.value['email'];
      var password = this.userForm.value['password'];

      this.studentForm.value['time'] = new Date().toLocaleString();
      this.studentService.create(this.studentForm.value)
        .then(async () => {
          this.poNotification.success('Aluno salvo com sucesso!');

          this.resetForm();
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar o aluno.');
          console.error(e);
        })

      this.userService.create(this.userForm.value)
        .then(async () => {
          var authApp = firebase.initializeApp({
            apiKey: "AIzaSyAaMvobDgsN2O2DQpjGk7Dg_w_8ao5MPII",
            authDomain: "facepresencemarker.firebaseapp.com",
            databaseURL: "https://facepresencemarker.firebaseio.com",
            projectId: "facepresencemarker",
            storageBucket: "facepresencemarker.appspot.com",
            messagingSenderId: "29444866679",
            appId: "1:29444866679:web:ab78908e47227818623c72",
            measurementId: "G-TX52PWWDXT"
          }, 'authApp');
          var detachedAuth = authApp.auth();

          detachedAuth.createUserWithEmailAndPassword(email, password);
         
          this.resetForm();
          location.reload();
        })
        .catch((e) => {
          console.error(e);
        })
    }

    this.getStudent();
  }

  getStudent(): void {
    this.studentService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.student = data;
      let studentId = this.student.pop().id;

      for (let index = 0; index < this.path.length; index++) {
        this.af.upload(`${studentId}/${index}`, this.path[index]);
      }
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  getStudentsByName() {
    this.itemsStudentsList = [];

    this.studentsService.getByName().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.itemsStudentsList = data;
    });
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'nome', label: 'Nome', type: 'string', width: '25%' },
      { property: 'matricula', label: 'Matricula', width: '10%' },
      { property: 'instituicao', label: 'Instituição', width: '20%' },
      { property: 'curso', label: 'Curso', width: '10%' },
      { property: 'turma', label: 'Turma', width: '10%' },
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        width: '3%',
        icons: [
          {
            action: (row) => this.editStudent(row),
            //color: this.isFavorite.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'editar'
          },
          {
            action: (row) => this.deleteStudent(row),
            //disabled: this.canGoToDocumentation.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Excluir',
            value: 'excluir'
          }
        ]
      }
    ];
  }

  deleteStudent(studentDelete): void {
    this.delete = studentDelete.id;
    this.modal.open();

    //this.classService.delete(classDelete.id);
    //this.getClass();

    //this.poNotification.success(`A Turma ${classDelete.nome} foi deletada com sucesso.`)
  }

  editStudent(studentEdit) {
    this.route.navigate(["register/students/edit", studentEdit.id]);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditStudents.valid) {
      this.route.navigate(['/']);
    } else {
      this.poDialog.confirm({
        title: `Confirm redirect to ${itemBreadcrumbLabel}`,
        message: `There is data that has not been saved yet. Are you sure you want to quit?`,
        confirm: () => this.route.navigate(['/'])
      });
    }
  }

}
