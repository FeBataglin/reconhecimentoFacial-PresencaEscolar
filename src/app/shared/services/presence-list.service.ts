import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { PoTableColumn } from '@po-ui/ng-components';
import { RecognitionModule } from 'src/app/recognition/recognition.module';
import { Recognition } from '../models/recognition/recognition.model';

@Injectable()
export class PresenceListService {

  presenceListRef: AngularFirestoreCollection<Recognition> = null;
  presenceListNameRef: AngularFirestoreCollection<Recognition> = null;
  
  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.presenceListRef = this.db.collection<Recognition>('lista_de_presenca');
    this.presenceListNameRef = this.db.collection<Recognition>('lista_de_presenca', ref => ref.orderBy('disciplina', 'asc'));
  }

  getColumns(): Array<PoTableColumn> {
    return [
      { property: 'data', label: 'Data', type: 'string', width: '1%'},
      { property: 'horaInicio', label: 'Hora Início', type: 'string', width: '12%'},
      { property: 'horaFim', label: 'Hora Fim', type: 'string', width: '10%'},
      { property: 'id', label: 'Aluno', width: '30%'},
      { property: 'responsavel', label: 'Responsável',  width: '28%'},
      {
        property: 'presenca',
        label: 'Presença',
        type: 'label',
        width: '13%',
        labels: [
          { value: 'presente', color: 'color-10', label: 'Presente'},
          { value: 'falta', color: 'color-07', label: 'Falta'},
          { value: 'faltaJustificada', color: 'color-08', label: 'Falta Justificada'},
          { value: 'faltaAbonada', color: 'color-02', label: 'Falta Abonada'},
        ]
      },
     
    ];
  }

  getItems(): AngularFirestoreCollection<Recognition> {
    return this.presenceListRef;
  }

  update(id, data: any): Promise<void> {
    return this.presenceListRef.doc(id).update(data);
  }

  getItemsByName(): AngularFirestoreCollection<Recognition> {
    return this.presenceListNameRef;
  }
}