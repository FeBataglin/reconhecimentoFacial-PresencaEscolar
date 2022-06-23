import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { CourseService } from 'src/app/shared/services/course.service';
import { InstituitionService } from 'src/app/shared/services/instituition.service';
import { ClassService } from './../../shared/services/class.service';

@Component({
  selector: 'app-classes',
  templateUrl: './classes.component.html',
  styleUrls: ['./classes.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class ClassesComponent implements OnInit {

  classForm: FormGroup;
  instituitions: Array<any> = [];
  courses: Array<any> = [];
  itemsClassList: Array<any> = [];
  columnsClassList: Array<any> = [];
  delete;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de Turmas' }]
  }

  opcoesInstituicao: Array<PoSelectOption>;
  opcoesCurso: Array<PoSelectOption>;

  @ViewChild('formEditClasses', { static: true }) formEditClasses: NgForm;
  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;
  
  primaryAction: PoModalAction = {
    action: () => {
      this.modal.close();
    },
    label: 'Fechar'
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.classService.delete(this.delete);
      this.getClass();
      this.modal.close();
      this.poNotification.success(`A Turma foi deletada com sucesso.`)
    },
    label: 'Confirmar'
  };

  constructor(
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private classService: ClassService,
    private instituitionService: InstituitionService,
    private courseService: CourseService,
    private router: Router
  ) { this.createClassForm(); }

  createClassForm() {
    this.classForm = this.formBuilder.group({
      nome: ['', Validators.required],
      instituicao: ['', Validators.required],
      curso: ['', [Validators.required]],
      periodo: [null, [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  resetForm() {
    this.classForm.reset();
    this.createClassForm();
  }

  ngOnInit(): void {
    this.getInstituitions();
    this.getCourses();
    this.columnsClassList = this.getColumns();
    this.getClass();
  }

  cancel() {
  }

  registerClass() {
    if (this.classForm.valid) {
      this.classService.create(this.classForm.value)
        .then(async () => {
          this.poNotification.success('Turma salva com sucesso!');

          this.resetForm();
          this.itemsClassList = [];
          this.getClass();
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar a turma.');
          console.error(e);
        })
    }
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
    this.itemsClassList = [];

    this.classService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.itemsClassList = data;
      
    });
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'nome', label: 'Nome', type: 'string', width: '25%' },
      { property: 'instituicao', label: 'Instituição', width: '25%' },
      { property: 'curso', label: 'Curso', width: '25%' },
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        width: '3%',
        icons: [
          {
            action: (row) => this.editClass(row),
            //color: this.isFavorite.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'editar'
          },
          {
            action: (row) => this.deleteClass(row),
            //disabled: this.canGoToDocumentation.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Excluir',
            value: 'excluir'
          }
        ]
      }
    ];
  }

  deleteClass(classDelete): void {
    this.delete = classDelete.id;
    this.modal.open();
    
    //this.classService.delete(classDelete.id);
    //this.getClass();
    
    //this.poNotification.success(`A Turma ${classDelete.nome} foi deletada com sucesso.`)
  }

  editClass(classEdit) {
    this.router.navigate(["register/classes/edit", classEdit.id]);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditClasses.valid) {
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
