import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { CourseService } from '../../../shared/services/course.service';
import { ClassService } from '../../../shared/services/class.service';
import { DisciplineService } from '../../../shared/services/discipline.service';
import 'rxjs/add/operator/map';
import { ResponsibleService } from '../../../shared/services/responsible.service';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines-edit.component.html',
  styleUrls: ['./disciplines-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class DisciplinesEditComponent implements OnInit {

  disciplineEditForm: FormGroup;
  responsible: Array<any> = [];
  class: Array<any> = [];

  newBreadcrumb: PoBreadcrumb = undefined;

  opcoesResponsavel: Array<PoSelectOption> = [];
  opcoesTurma: Array<PoSelectOption> = [];

  nome;
  turma;
  responsavel;
  periodo;
  horaInicio;
  horaFim;
  qntdImagens;
  qntdPresenca;
  cargaHoraria;

  @ViewChild('imagens', { read: ElementRef, static: true }) qntdImagensRef: ElementRef;
  @ViewChild('presenca', { read: ElementRef, static: true }) qntdPresencaRef: ElementRef;
  @ViewChild('carga', { read: ElementRef, static: true }) cargaHorariaRef: ElementRef;
  

  constructor(
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private disciplineService: DisciplineService,
    private responsibleService: ResponsibleService,
    private classService: ClassService
  ) { this.createDisciplineForm(); }

  createDisciplineForm() {
    this.disciplineEditForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      turma: ['', [Validators.required]],
      responsavel: ['', [Validators.required]],
      periodo: ['', [Validators.required]],
      horaInicio: ['', [Validators.required]],
      horaFim: ['', [Validators.required]],
      qntdImagens: ['', [Validators.required]],
      qntdPresenca: ['', [Validators.required]],
      cargaHoraria: ['', [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  registerDiscipline() {
    const id = this.activatedRoute.snapshot.params.id;

    this.disciplineEditForm.value['horaInicio'] = this.disciplineEditForm.value['horaInicio'].replace(":", "") ;
    this.disciplineEditForm.value['horaFim'] = this.disciplineEditForm.value['horaFim'].replace(":", "") ;
    this.disciplineEditForm.value['horaInicio'] = this.disciplineEditForm.value['horaInicio'];
    this.disciplineEditForm.value['horaFim'] = this.disciplineEditForm.value['horaFim'];

    if (this.disciplineEditForm.valid) {
      this.disciplineService.update(id, this.disciplineEditForm.value)
        .then(async () => {
          this.poNotification.success('Disciplina alterada com sucesso!');

          this.resetForm();
          this.router.navigate(["register/disciplines/"]);
        })
        .catch((e) => {
          this.poNotification.error('Erro ao alterar a disciplina.');
          console.error(e);
        })
    }
  }

  resetForm() {
    this.disciplineEditForm.reset();
  }

  ngOnInit(): void {
    this.getResponsible();
    this.getClass()
    this.getDiscipline();
  }

  cancel() {
    this.router.navigateByUrl("register/disciplines")
  }

  getResponsible() {
    this.responsibleService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {

      for (let i = 0; i < data.length; i++) {
        this.responsible.push({
          value: data[i].nome,
          label: data[i].nome
        })
      }
      this.opcoesResponsavel = this.responsible;
    });
  }

  getClass() {
    this.classService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
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

  getDiscipline() {
    const id = this.activatedRoute.snapshot.params.id;

    this.newBreadcrumb = {
      items: [
        { label: "Cadastro de Disciplina", link: "register/disciplines" },
        { label: "Edição de Disciplina" }
      ]
    }

    this.disciplineService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          this.nome = data[i].nome;
          this.turma = data[i].turma;
          this.responsavel = data[i].responsavel;
          this.periodo = data[i].periodo;
          this.horaInicio = data[i].horaInicio.toString().substring(0, 2) + ":" + data[i].horaInicio.toString().substring(2);
          this.horaFim = data[i].horaFim.toString().substring(0, 2) + ":" + data[i].horaFim.toString().substring(2);
          this.qntdImagens = data[i].qntdImagens;
          this.qntdPresenca = data[i].qntdPresenca;
          this.cargaHoraria = data[i].cargaHoraria;
        }
      }
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.disciplineEditForm.valid) {
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
