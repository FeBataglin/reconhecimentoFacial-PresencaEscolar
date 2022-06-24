import { Injectable } from '@angular/core';

import { PoTableColumn } from '@po-ui/ng-components';

@Injectable()
export class ManualPresenceService {

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'aluno', label: 'Aluno'},
      { property: 'data', label: 'Data', type: 'date'},
      { property: 'entrada', label: 'Entrada'},
      { property: 'saida', label: 'Saída'},
      { property: 'falta', label: 'Responsável', type: 'checkbox'},
    ];
  }

  getItems(): Array<any> {
    return [
      {
        aluno: 'Aluno 1',
        data: '01/09/2020',
        entrada: '19:15',
        saida: 'presente'
      },
    ];
  }

}