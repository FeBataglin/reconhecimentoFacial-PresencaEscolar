import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoNotificationService, PoSelectOption } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { CourseService } from '../../../shared/services/course.service';
import { InstituitionService } from '../../../shared/services/instituition.service';
import { ClassService } from '../../../shared/services/class.service';
import { Course } from '../../../shared/models/course/course.model';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-courses',
  templateUrl: './courses-edit.component.html',
  styleUrls: ['./courses-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class CourseEditComponent implements OnInit {

  courseEditForm: FormGroup;
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
  codigo;
  instituicao;
  periodo;
  ativo;

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
  ) { this.createCourseForm(); }

  createCourseForm() {
    this.courseEditForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      codigo: [null, [Validators.required]],
      instituicao: ['', [Validators.required]],
      periodo: [null, [Validators.required]],
      ativo: [null, [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  registerCourse() {
    const id = this.activatedRoute.snapshot.params.id;

    if (this.courseEditForm.valid) {
      this.courseService.update(id, this.courseEditForm.value)
        .then(async () => {
          this.poNotification.success('Curso alterado com sucesso!');

          this.resetForm();
          this.router.navigate(["register/courses/"]);
        })
        .catch((e) => {
          this.poNotification.error('Erro ao alterar o curso.');
          console.error(e);
        })
    }
  }

  resetForm() {
    this.courseEditForm.reset();
  }

  ngOnInit(): void {
    this.getInstituitions();
    this.getCourses();
  }

  cancel() {
    this.route.navigateByUrl("register/courses")
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
    const id = this.activatedRoute.snapshot.params.id;

    this.newBreadcrumb = {
      items: [
        { label: "Cadastro de Curso", link: "register/courses" },
        { label: "Edição de Curso" }
      ]
    }

    this.courseService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          this.nome = data[i].nome;
          this.codigo = data[i].codigo;
          this.instituicao = data[i].instituicao;
          this.periodo = data[i].periodo;
          this.ativo = data[i].ativo;
        }
      }
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.courseEditForm.valid) {
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
