import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { CourseService } from './../../../shared/services/course.service';
import { InstituitionService } from './../../../shared/services/instituition.service';
import { ClassService } from './../../../shared/services/class.service';
import { Class } from 'src/app/shared/models/classes/class.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-classes',
  templateUrl: './classes-edit.component.html',
  styleUrls: ['./classes-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ClassesEditComponent implements OnInit {

  classEditForm: FormGroup;
  instituitions: Array<any> = [];
  courses: Array<any> = [];
  itemsClassList: Array<any> = [];
  columnsClassList: Array<any> = [];

  newBreadcrumb: PoBreadcrumb = undefined;

  opcoesInstituicao: Array<PoSelectOption>;
  opcoesCurso: Array<PoSelectOption>;

  classRefDocument: AngularFirestoreCollection<any> = null;

  classRefId: AngularFirestoreDocument<any> = null;
  userDoc$: Observable<any>;

  nome;
  curso;
  instituicao;
  periodo;

  @ViewChild('formEditClasses', { static: true }) editForm: NgForm;

  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private classService: ClassService,
    private instituitionService: InstituitionService,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private router: Router
  ) { this.createClassForm(); }

  createClassForm() {
    this.classEditForm = this.formBuilder.group({
      nome: ['',[Validators.required]],
      instituicao: ['', [Validators.required]],
      curso: ['', [Validators.required]],
      periodo: [null, [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  registerClass() {
    const id = this.activatedRoute.snapshot.params.id;

    if (this.classEditForm.valid) {
      this.classService.update(id, this.classEditForm.value)
        .then(async () => {
          this.poNotification.success('Turma alterada com sucesso!');

          this.resetForm();
          this.router.navigate(["register/classes/"]);
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar a turma.');
          console.error(e);
        })
    }
  }

  resetForm() {
    this.classEditForm.reset();
  }

  ngOnInit(): void {
    this.getInstituitions();
    this.getCourses();
    this.getClass();
  }

  cancel() {
    this.route.navigateByUrl("register/classes")
  }

  getInstituitions() {
    this.instituitionService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
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
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
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
    const id = this.activatedRoute.snapshot.params.id;

    this.newBreadcrumb = {
      items: [
        { label: "Cadastro de Turma", link: "register/classes" },
        { label: "Edição de Turma" }
      ]
    }

    this.classService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if(data[i].id === id){
          this.nome = data[i].nome;
          this.curso = data[i].curso;
          this.instituicao = data[i].instituicao;
          this.periodo = data[i].periodo;
        }
      }
      this.opcoesCurso = this.courses;
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.editForm.valid) {
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
