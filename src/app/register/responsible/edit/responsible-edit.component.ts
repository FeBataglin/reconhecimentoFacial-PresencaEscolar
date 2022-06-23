import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { ClassService } from './../../../shared/services/class.service';
import { CourseService } from './../../../shared/services/course.service';
import { InstituitionService } from './../../../shared/services/instituition.service';
import { ResponsibleService } from './../../../shared/services/responsible.service';
import 'rxjs/add/operator/map';

@Component({
  selector: 'app-responsible',
  templateUrl: './responsible-edit.component.html',
  styleUrls: ['./responsible-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class ResponsibleEditComponent implements OnInit {

  responsibleEditForm: FormGroup;
  responsible: Array<any> = [];

  newBreadcrumb: PoBreadcrumb = undefined;

  courses: Array<any> = [];
  class: Array<any> = [];
  instituitions: Array<any> = [];

  opcoesInstituicao: Array<PoSelectOption> = [];
  opcoesTurma: Array<PoSelectOption> = [];
  opcoesCurso: Array<PoSelectOption> = [];

  nome;
  cpf;
  instituicao;
  curso;
  turma;
  periodo;

  constructor(
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private responsibleService: ResponsibleService,
    private courseService: CourseService,
    private instituitionService: InstituitionService,
    private classService: ClassService,
  ) { this.createResponsibleForm(); }

  createResponsibleForm() {
    this.responsibleEditForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      cpf: ['', [Validators.required]],
      email: ['', [Validators.required]],
      instituicao: [null, [Validators.required]],
      curso: ['', [Validators.required]],
      turma: [null, [Validators.required]],
      periodo: ['', [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  registerResponsible() {
    const id = this.activatedRoute.snapshot.params.id;

    if (this.responsibleEditForm.valid) {
      this.responsibleService.update(id, this.responsibleEditForm.value)
        .then(async () => {
          this.poNotification.success('Responsáel alterado com sucesso!');

          this.resetForm();
          this.router.navigate(["register/responsible/"]);
        })
        .catch((e) => {
          this.poNotification.error('Erro ao alterar o responsável.');
          console.error(e);
        })
    }
  }

  resetForm() {
    this.responsibleEditForm.reset();
  }

  ngOnInit(): void {
    this.getClass();
    this.getCourses();
    this.getInstituitions();
    this.getResponsible();
  }

  cancel() {
    this.router.navigateByUrl("register/instituition")
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
      this.opcoesCurso= this.courses;
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
    const id = this.activatedRoute.snapshot.params.id;

    this.newBreadcrumb = {
      items: [
        { label: "Cadastro de Responsáel", link: "register/responsible" },
        { label: "Edição de Responsável" }
      ]
    }

    this.responsibleService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          this.nome = data[i].nome;
          this.cpf = data[i].cpf;
          this.instituicao = data[i].instituicao;
          this.curso = data[i].curso;
          this.turma = data[i].turma;
          this.periodo = data[i].periodo;
        }
      }
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.responsibleEditForm.valid) {
      this.router.navigate(['/']);
    } else {
      this.poDialog.confirm({
        title: `Confirm redirect to ${itemBreadcrumbLabel}`,
        message: `There is data that has not been saved yet. Are you sure you want to quit?`,
        confirm: () => this.router.navigate(['/'])
      });
    }
  }

}
