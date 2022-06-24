import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoRadioGroupOption, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { Discipline } from 'src/app/shared/models/disciplines/discipline.model';
import { ClassService } from 'src/app/shared/services/class.service';
import { DisciplineService } from 'src/app/shared/services/discipline.service';
import { ResponsibleService } from 'src/app/shared/services/responsible.service';

@Component({
  selector: 'app-disciplines',
  templateUrl: './disciplines.component.html',
  styleUrls: ['./disciplines.component.css']
})
export class DisciplinesComponent implements OnInit {

  disciplineForm: FormGroup;
  responsible: Array<any> = [];
  class: Array<any> = [];
  itemsDisciplineList: Array<any> = [];
  columnsDisciplineList: Array<any> = [];

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de Disciplinas' }]
  }
  
  opcoesResponsavel: Array<PoSelectOption> = [];
  opcoesTurma: Array<PoSelectOption> = [];

  delete;
  
  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;
  @ViewChild('formEditDiscipline', { static: true }) formEditDiscipline: NgForm;
  @ViewChild('qntdImagens', { read: ElementRef, static: true }) qntdImagensRef: ElementRef;
  @ViewChild('qntdPresenca', { read: ElementRef, static: true }) qntdPresencaRef: ElementRef;
  @ViewChild('cargaHoraria', { read: ElementRef, static: true }) cargaHorariaRef: ElementRef;

  primaryAction: PoModalAction = {
    action: () => {
      this.modal.close();
    },
    label: 'Fechar'
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.disciplineService.delete(this.delete);
      this.getDisciplines();
      this.modal.close();
      this.poNotification.success(`A disciplina foi deletada com sucesso.`)
    },
    label: 'Confirmar'
  };

  constructor(
    private router: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private disciplineService: DisciplineService,
    private responsibleService: ResponsibleService,
    private classService: ClassService
  ) 
  { this.createDisciplineForm(); }

  ngOnInit(): void {
    this.getResponsible();
    this.getClass();
    this.columnsDisciplineList = this.getColumns();
    this.getDisciplines();
  }
  
  createDisciplineForm() {
    this.disciplineForm = this.formBuilder.group({
      nome: ['', Validators.required],
      turma: ['', Validators.required],
      responsavel: ['', Validators.required],
      periodo: [null, [Validators.required]],
      horaInicio: [null, [Validators.required]],
      horaFim: [null, [Validators.required]],
      qntdImagens: [null, [Validators.required]],
      qntdPresenca: [null, [Validators.required]],
      cargaHoraria: [null, [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  resetForm() {
    this.disciplineForm.reset();
    this.createDisciplineForm();
  }

  registerDiscipline() {
    if (this.disciplineForm.valid) {
      this.disciplineForm.value['horaInicio'] = this.disciplineForm.value['horaInicio'].replace(":", "");
      this.disciplineForm.value['horaFim'] = this.disciplineForm.value['horaFim'].replace(":", "");
      this.disciplineService.create(this.disciplineForm.value)
        .then(async () => {
          this.poNotification.success('Disciplina salva com sucesso!');

          this.resetForm();
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar a disciplina.');
          console.error(e);
        })
    }
  }

  cancel() {
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

  getDisciplines() {
    this.itemsDisciplineList = [];

    this.disciplineService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.itemsDisciplineList = data;

      for (let index = 0; index < this.itemsDisciplineList.length; index++) {
        this.itemsDisciplineList[index].horaInicio = this.itemsDisciplineList[index].horaInicio.toString().substring(0, 2) + ":" + this.itemsDisciplineList[index].horaInicio.toString().substring(2);
        this.itemsDisciplineList[index].horaFim = this.itemsDisciplineList[index].horaFim.toString().substring(0, 2) + ":" + this.itemsDisciplineList[index].horaFim.toString().substring(2);
      }
    });
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'nome', label: 'Nome', type: 'string', width: '20%' },
      { property: 'responsavel', label: 'Responsável', width: '20%' },
      { property: 'horaInicio', label: 'Início', width: '5%'},
      { property: 'horaFim', label: 'Fim', width: '5%'},
      { property: 'qntdImagens', label: 'Quant. Imagens', width: '10%'},
      { property: 'qntdPresenca', label: 'Quant. Capturas', width: '10%'},
      { property: 'cargaHoraria', label: 'Carga Horária', width: '8%'},
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        width: '6%',
        icons: [
          {
            action: (row) => this.editDiscipline(row),
            //color: this.isFavorite.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'editar'
          },
          {
            action: (row) => this.deleteDiscipline(row),
            //disabled: this.canGoToDocumentation.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Excluir',
            value: 'excluir'
          }
        ]
      }
    ];
  }

  deleteDiscipline(disciplineDelete): void {
    this.delete = disciplineDelete.id;
    this.modal.open();
    
    //this.classService.delete(classDelete.id);
    //this.getClass();
    
    //this.poNotification.success(`A Turma ${classDelete.nome} foi deletada com sucesso.`)
  }

  editDiscipline(disciplineEdit) {
    this.router.navigate(["register/disciplines/edit", disciplineEdit.id]);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditDiscipline.valid) {
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
