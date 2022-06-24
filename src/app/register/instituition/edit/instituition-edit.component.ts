import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { map } from 'rxjs/operators';
import { CourseService } from '../../../shared/services/course.service';
import 'rxjs/add/operator/map';
import { InstituitionService } from 'src/app/shared/services/instituition.service';

@Component({
  selector: 'app-instituition',
  templateUrl: './instituition-edit.component.html',
  styleUrls: ['./instituition-edit.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class InstituitionEditComponent implements OnInit {

  instituitionEditForm: FormGroup;
  responsible: Array<any> = [];
  class: Array<any> = [];

  newBreadcrumb: PoBreadcrumb = undefined;

  opcoesResponsavel: Array<PoSelectOption> = [];
  opcoesTurma: Array<PoSelectOption> = [];

  instituicao;
  telefone;
  cnpj;
  email;
  cep;
  estado;
  cidade;
  numero;
  rua;
  bairro

  constructor(
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private courseService: CourseService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private instituitionService: InstituitionService
  ) { this.createInstituitionForm(); }

  createInstituitionForm() {
    this.instituitionEditForm = this.formBuilder.group({
      instituicao: ['', [Validators.required]],
      telefone: ['', [Validators.required]],
      cnpj: [null, [Validators.required]],
      email: ['', [Validators.required]],
      cep: [null, [Validators.required]],
      estado: ['', [Validators.required]],
      cidade: ['', [Validators.required]],
      numero: [null, [Validators.required]],
      rua: ['', [Validators.required]],
      bairro: ['', [Validators.required]],
      acoes: [["editar", "excluir"]]
    });
  }

  registerInstituition() {
    const id = this.activatedRoute.snapshot.params.id;

    if (this.instituitionEditForm.valid) {
      this.instituitionService.update(id, this.instituitionEditForm.value)
        .then(async () => {
          this.poNotification.success('Instituição alterada com sucesso!');

          this.resetForm();
          this.router.navigate(["register/instituition/"]);
        })
        .catch((e) => {
          this.poNotification.error('Erro ao alterar a instituição.');
          console.error(e);
        })
    }
  }

  resetForm() {
    this.instituitionEditForm.reset();
  }

  ngOnInit(): void {
    this.getInstituition();
  }

  cancel() {
    this.router.navigateByUrl("register/instituition")
  }

  getInstituition() {
    const id = this.activatedRoute.snapshot.params.id;

    this.newBreadcrumb = {
      items: [
        { label: "Cadastro de Instituição", link: "register/instituition" },
        { label: "Edição de Instituição" }
      ]
    }

    this.instituitionService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === id) {
          this.instituicao = data[i].instituicao;
          this.telefone = data[i].telefone;
          this.cnpj = data[i].cnpj;
          this.email = data[i].email;
          this.cep = data[i].cep;
          this.estado = data[i].estado;
          this.cidade = data[i].cidade;
          this.rua = data[i].rua;
          this.numero = data[i].numero;
          this.bairro = data[i].bairro;
        }
      }
    });
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.instituitionEditForm.valid) {
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
