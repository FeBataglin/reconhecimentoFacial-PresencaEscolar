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
import { StudentService } from 'src/app/shared/services/student.service';
import { DisciplineService } from 'src/app/shared/services/discipline.service';
import { AngularFireStorage } from '@angular/fire/storage';

@Component({
  selector: 'app-students',
  templateUrl: './students-edit.component.html',
  styleUrls: ['./students-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class StudentsEditComponent implements OnInit {
  student: any;
  studentsEditForm: FormGroup;
  responsible: Array<any> = [];

  newBreadcrumb: PoBreadcrumb = undefined;

  courses: Array<any> = [];
  class: Array<any> = [];
  instituitions: Array<any> = [];
  disciplines: Array<any> = [];

  opcoesInstituicao: Array<PoSelectOption> = [];
  opcoesTurma: Array<PoSelectOption> = [];
  opcoesCurso: Array<PoSelectOption> = [];
  opcoesDisciplina: Array<PoSelectOption> = [];

  time;

  path: Array<any>;
  fileLenght;
  archiveName: Array<any[]>;

  nome;
  matricula;
  instituicao;
  curso;
  turma;
  disciplina;

  constructor(
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private af: AngularFireStorage,
    private instituitionService: InstituitionService,
    private courseService: CourseService,
    private classService: ClassService,
    private studentsService: StudentService,
    private disciplinesService: DisciplineService
  ) { this.createStudentsForm(); }

  createStudentsForm() {
    this.studentsEditForm = this.formBuilder.group({
      nome: ['', [Validators.required]],
      matricula: ['', [Validators.required]],
      email: ['', [Validators.required]],
      instituicao: [null, [Validators.required]],
      curso: ['', [Validators.required]],
      turma: [null, [Validators.required]],
      disciplina: ['', [Validators.required]],
      admin: false,
      time: this.getTime(),
      acoes: [["editar", "excluir"]]
    });
  }

  getTime() {
    this.time = new Date().toLocaleString();
    return this.time;
  }

  registerStudent() {
    const id = this.activatedRoute.snapshot.params.id;

    if (this.studentsEditForm.valid) {
      this.studentsEditForm.value['time'] = new Date().toLocaleString();
      this.studentsService.update(id, this.studentsEditForm.value)
        .then(async () => {
          this.poNotification.success('Aluno alterado com sucesso!');

          this.resetForm();
          this.router.navigate(["register/students/"]);
        })
        .catch((e) => {
          this.poNotification.error('Erro ao alterar o aluno.');
          console.error(e);
        })
    }

    this.getStudent();
  }

  getStudent(): void {
    this.studentsService.getAll().snapshotChanges().pipe(
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

  resetForm() {
    this.studentsEditForm.reset();
  }

  ngOnInit(): void {
    this.getInstituitions();
    this.getClass();
    this.getCourses();
    this.getDisciplines();
    this.getStudents();
  }

  cancel() {
    this.router.navigateByUrl("register/students")
  }

  getDisciplines() {
    this.disciplinesService.getAll().snapshotChanges().pipe(
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

  getStudents() {
    const id = this.activatedRoute.snapshot.params.id;

    this.newBreadcrumb = {
      items: [
        { label: "Cadastro de Alunos", link: "register/students" },
        { label: "Edição de Aluno" }
      ]
    }

    this.studentsService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc['id'], ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          this.nome = data[i].nome;
          this.matricula = data[i].matricula;
          this.instituicao = data[i].instituicao;
          this.curso = data[i].curso;
          this.turma = data[i].turma;
          this.disciplina = data[i].disciplina;
        }
      }
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  upload($event) {
    this.path = $event.target.files;
    this.fileLenght = $event.target.files.length;
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.studentsEditForm.valid) {
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
