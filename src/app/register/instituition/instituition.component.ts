import { HttpClient } from '@angular/common/http';
import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, NgForm, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { PoBreadcrumb, PoDialogService, PoModalAction, PoModalComponent, PoNotificationService, PoSelectOption, PoTableColumn } from '@po-ui/ng-components';
import { InstituitionService } from 'src/app/shared/services/instituition.service';
import { of } from 'rxjs';
import { ConsultaCEPService } from 'src/app/shared/services/consultaCEP.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-instituition',
  templateUrl: './instituition.component.html',
  styleUrls: ['./instituition.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class InstituitionComponent implements OnInit {

  instituitionForm: FormGroup;
  estado: string;
  cidade: string;
  rua: string;
  bairro: string;

  itemsInstituitionList: Array<any> = [];
  columnsInstituitionList: Array<any> = [];

  delete;

  public readonly breadcrumb: PoBreadcrumb = {
    items: [{ label: 'Início', action: this.beforeRedirect.bind(this) }, { label: 'Cadastro de Instituição' }]
  }

  @ViewChild('formEditInstituition', { static: true }) formEditInstituition: NgForm;
  @ViewChild(PoModalComponent, { static: true }) modal: PoModalComponent;
  
  primaryAction: PoModalAction = {
    action: () => {
      this.modal.close();
    },
    label: 'Fechar'
  };

  secondaryAction: PoModalAction = {
    action: () => {
      this.instituitionService.delete(this.delete);
      this.getInstituition();
      this.modal.close();
      this.poNotification.success(`A instituição foi deletada com sucesso.`)
    },
    label: 'Confirmar'
  };
  
  constructor(
    private route: Router,
    private poDialog: PoDialogService,
    private poNotification: PoNotificationService,
    private formBuilder: FormBuilder,
    private instituitionService: InstituitionService,
    private http: HttpClient,
    private cepService: ConsultaCEPService
  ) { this.createInstituitionForm() }

  ngOnInit(): void {
    this.initialize();
    this.columnsInstituitionList = this.getColumns();
    this.getInstituition();
  }

  createInstituitionForm() {
    this.instituitionForm = this.formBuilder.group({
      instituicao: ['', Validators.required],
      telefone: [null, Validators.required],
      cnpj: [null, Validators.required],
      email: ['', Validators.required],
      estado: ['', Validators.required],
      cidade: ['', Validators.required],
      numero: [null, Validators.required],
      rua: ['', Validators.required],
      cep: [null, Validators.required],
      bairro: ['', Validators.required],
      acoes: [["editar", "excluir"]]
    });
  }

  registerInstituition() {
    if (this.instituitionForm.valid) {
      this.instituitionService.create(this.instituitionForm.value)
        .then(async () => {
          this.poNotification.success('Instituição salva com sucesso!');

          this.resetForm();
        })
        .catch((e) => {
          this.poNotification.error('Erro ao salvar a Instituição.');
          console.error(e);
        })
    }
  }



  resetForm() {
    this.instituitionForm.reset();
    this.createInstituitionForm();
  }

  cancel() {
    this.initialize();
  }

  initialize() {

  }

  consultaCEP(cep) {

    console.log(cep)
    // Nova variável "cep" somente com dígitos.
    cep = cep.replace(/\D/g, '');

    if (cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
        .subscribe(dados => this.populaDadosForm(dados));
    }
  }

  populaDadosForm(dados) {
    if (dados.erro) {
      this.poNotification.error("CEP inválido.")
    } else {
      this.estado = dados.uf;
      this.cidade = dados.localidade;
      this.rua = dados.logradouro;
      this.bairro = dados.bairro;
    }
  }

  save() {
    this.poNotification.success(`Salvo com sucesso.`);
  }

  getInstituition() {
    this.itemsInstituitionList = [];

    this.instituitionService.getAll().snapshotChanges().pipe(
      map(changes =>
        changes.map(c =>
          ({ id: c.payload.doc.id, ...c.payload.doc.data() })
        )
      )
    ).subscribe(data => {
      this.itemsInstituitionList = data;
      
      for (let index = 0; index < this.itemsInstituitionList.length; index++) {
        this.itemsInstituitionList[index].cidade = this.itemsInstituitionList[index].cidade + "/" + this.itemsInstituitionList[index].estado
      }

    });
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'instituicao', label: 'Instituição', type: 'string'},
      { property: 'telefone', label: 'Telefone', width: '10%' },
      { property: 'email', label: 'E-mail', width: '30%'},
      { property: 'cidade', label: 'Cidade', width: '15%'},
      {
        property: 'acoes',
        label: 'Ações',
        type: 'icon',
        width: '6%',
        icons: [
          {
            action: (row) => this.editInstituition(row),
            //color: this.isFavorite.bind(this),
            icon: 'po-icon-edit',
            tooltip: 'Editar',
            value: 'editar'
          },
          {
            action: (row) => this.deleteInstituition(row),
            //disabled: this.canGoToDocumentation.bind(this),
            icon: 'po-icon-delete',
            tooltip: 'Excluir',
            value: 'excluir'
          }
        ]
      }
    ];
  }

  deleteInstituition(instituitionDelete): void {
    this.delete = instituitionDelete.id;
    this.modal.open();
    
    //this.classService.delete(classDelete.id);
    //this.getClass();
    
    //this.poNotification.success(`A Turma ${classDelete.nome} foi deletada com sucesso.`)
  }

  editInstituition(instituitionEdit) {
    this.route.navigate(["register/instituition/edit", instituitionEdit.id]);
  }

  private beforeRedirect(itemBreadcrumbLabel) {
    if (this.formEditInstituition.valid) {
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
