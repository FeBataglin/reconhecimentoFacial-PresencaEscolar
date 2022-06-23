import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { CourseService } from 'src/app/shared/services/course.service';
import { InstituitionService } from 'src/app/shared/services/instituition.service';

@Component({
  selector: 'app-courses',
  templateUrl: './courses.component.html',
  styleUrls: ['./courses.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class CoursesComponent implements OnInit {

  courseForm: FormGroup;
  instituitions: Array<any> = [];
  opcoesInstituicao: Array<PoSelectOption> = [];

  itemsCourseList: Array<any> = [];
  columnsCourseList: Array<any> = [];
  delete;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de Cursos' }]
  }

  @ViewChild('formEditClasses', { static: true }) formEditCourses: NgForm;
  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;
  
  primaryAction: PoModalAction = {
    action: () => {
      this.modal.close();
    },
    label: 'Fechar'
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.courseService.delete(this.delete);
      this.getCourses();
      this.modal.close();
      this.poNotification.success(`O curso foi deletado com sucesso.`)
    },
    label: 'Confirmar'
  };

  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private instituitionService: InstituitionService,
    private router: Router
  ) { this.createCoursesForm() }

  createCoursesForm() {
    this.courseForm = this.formBuilder.group({
      nome: ['', Validators.required],
      codigo: [null, Validators.required],
      instituicao: ['', [Validators.required]],
      periodo: [null, [Validators.required]],
      ativo: [true, [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  ngOnInit(): void {
    this.getInstituitions();
    this.columnsCourseList = this.getColumns();
    this.getCourses();
  }

  cancel() {
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

  registerCourse() {
    if (this.courseForm.valid) {
      this.courseService.create(this.courseForm.value)
        .then(async () => {
          this.poNotification.success('Curso salvo com sucesso!');

          this.resetForm();
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar o curso.');
          console.error(e);
        })
    }
  }

  resetForm() {
    this.courseForm.reset();
    this.createCoursesForm();
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  getCourses() {
    this.itemsCourseList = [];

    this.courseService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.itemsCourseList = data;
      
    });
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'nome', label: 'Nome', type: 'string', width: '25%' },
      { property: 'codigo', label: 'Código', width: '5%' },
      { property: 'instituicao', label: 'Instituição', width: '25%' },
      { property: 'curso', label: 'Curso', width: '20%' },
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        width: '3%',
        icons: [
          {
            action: (row) => this.editCourse(row),
            //color: this.isFavorite.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'editar'
          },
          {
            action: (row) => this.deleteCourse(row),
            //disabled: this.canGoToDocumentation.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Excluir',
            value: 'excluir'
          }
        ]
      }
    ];
  }

  deleteCourse(courseDelete): void {
    this.delete = courseDelete.id;
    this.modal.open();
    
    //this.classService.delete(classDelete.id);
    //this.getClass();
    
    //this.poNotification.success(`A Turma ${classDelete.nome} foi deletada com sucesso.`)
  }

  editCourse(courseEdit) {
    this.router.navigate(["register/courses/edit", courseEdit.id]);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditCourses.valid) {
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
