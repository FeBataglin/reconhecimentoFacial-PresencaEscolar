import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { ClassService } from 'src/app/shared/services/class.service';
import { CourseService } from 'src/app/shared/services/course.service';
import { InstituitionService } from 'src/app/shared/services/instituition.service';
import { ResponsibleService } from 'src/app/shared/services/responsible.service';
import { UserService } from 'src/app/shared/services/user.service';
import { AngularFireAuth } from '@angular/fire/auth';
import * as firebase from 'firebase';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible.component.html',
  styleUrls: ['./responsible.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ResponsibleComponent implements OnInit {

  responsibleForm: FormGroup;
  userForm: FormGroup;
  disciplines: Array<any> = [];
  courses: Array<any> = [];
  class: Array<any> = [];
  instituitions: Array<any> = [];

  itemsResponsibleList: Array<any> = [];
  columnsResponsibleList: Array<any> = [];
  delete;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de Responsável' }]
  }

  opcoesInstituicao: Array<PoSelectOption> = [];

  opcoesTurma: Array<PoSelectOption> = [];

  opcoesCurso: Array<PoSelectOption> = [];

  @ViewChild('formEditResponsible', { static: true }) formEditResponsible: NgForm;
  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;

  primaryAction: PoModalAction = {
    action: () => {
      this.modal.close();
    },
    label: 'Fechar'
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.responsibleService.delete(this.delete);
      this.getResponsible();
      this.modal.close();
      this.poNotification.success(`O responsável foi deletado com sucesso.`)
    },
    label: 'Confirmar'
  };

  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private responsibleService: ResponsibleService,
    private courseService: CourseService,
    private instituitionService: InstituitionService,
    private classService: ClassService,
    private userService: UserService,
    private afAuth: AngularFireAuth,
    public appComponent: AppComponent
  ) {
    this.createResponsibleForm();
    this.createUserForm();
  }

  ngOnInit(): void {
    this.getClass();
    this.getCourses();
    this.getInstituitions();
    this.columnsResponsibleList = this.getColumns();
    this.getResponsible();
  }

  createResponsibleForm() {
    this.responsibleForm = this.formBuilder.group({
      nome: ['', Validators.required],
      cpf: [null, Validators.required],
      email: ['', Validators.required],
      instituicao: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      turma: ['', [Validators.required]],
      periodo: [null, [Validators.required]],
      admin: true,
      acoes: [["editar", "excluir"]]
    });
  }

  createUserForm() {
    this.userForm = this.formBuilder.group({
      email: [''],
      password: [''],
      admin: true,
      nome: [''],
      identificacao: [null]
    });
  }

  cancel() {
    this.initialize();
  }

  registerResponsible() {
    if (this.responsibleForm.valid) {

      this.userForm.value['email'] = this.responsibleForm.value['email'];
      this.userForm.value['password'] = `${this.responsibleForm.value['cpf']}@senai`;
      this.userForm.value['admin'] = this.responsibleForm.value['admin'];
      this.userForm.value['nome'] = this.responsibleForm.value['nome'];
      this.userForm.value['identificacao'] = this.responsibleForm.value['cpf'];

      var email = this.userForm.value['email'];
      var password = this.userForm.value['password'];

      this.responsibleService.create(this.responsibleForm.value)
        .then(async () => {
          this.poNotification.success('Responsável salvo com sucesso!');

          this.resetForm();
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar o responsável.');
          console.error(e);
        })

      this.userService.create(this.userForm.value)
        .then(() => {
          var authAppResponsible = firebase.initializeApp({
            apiKey: "AIzaSyAaMvobDgsN2O2DQpjGk7Dg_w_8ao5MPII",
            authDomain: "facepresencemarker.firebaseapp.com",
            databaseURL: "https://facepresencemarker.firebaseio.com",
            projectId: "facepresencemarker",
            storageBucket: "facepresencemarker.appspot.com",
            messagingSenderId: "29444866679",
            appId: "1:29444866679:web:ab78908e47227818623c72",
            measurementId: "G-TX52PWWDXT"
          }, 'authAppResponsible');
          var detachedAuth = authAppResponsible.auth();

          detachedAuth.createUserWithEmailAndPassword(email, password);
          
          this.resetForm();
          location.reload();
        })
        .catch((e) => {
          console.error(e);
        })
    }
    this.getResponsible();
  }



  resetForm() {
    this.responsibleForm.reset();
    this.userForm.reset();
    this.createResponsibleForm();
    this.createUserForm();
  }

  initialize() {
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
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

  getResponsible() {
    this.itemsResponsibleList = [];

    this.responsibleService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.itemsResponsibleList = data;

    });
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'nome', label: 'Nome', type: 'string', width: '25%' },
      { property: 'instituicao', label: 'Instituição', width: '25%' },
      { property: 'curso', label: 'Disciplina', width: '20%' },
      { property: 'turma', label: 'Turma', width: '20%' },
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        width: '3%',
        icons: [
          {
            action: (row) => this.editResponsible(row),
            //color: this.isFavorite.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'editar'
          },
          {
            action: (row) => this.deleteResponsible(row),
            //disabled: this.canGoToDocumentation.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Excluir',
            value: 'excluir'
          }
        ]
      }
    ];
  }

  deleteResponsible(responsibleDelete): void {
    this.delete = responsibleDelete.id;
    this.modal.open();

    //this.classService.delete(classDelete.id);
    //this.getClass();

    //this.poNotification.success(`A Turma ${classDelete.nome} foi deletada com sucesso.`)
  }

  editResponsible(responsibleEdit) {
    this.route.navigate(["register/responsible/edit", responsibleEdit.id]);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditResponsible.valid) {
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
