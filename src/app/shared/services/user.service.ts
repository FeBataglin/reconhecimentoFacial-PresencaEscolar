import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument } from '@angular/fire/firestore';
import { Class } from '../models/classes/class.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Observable } from 'rxjs';
import 'rxjs/add/operator/map';
import { User } from '../models/users/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  userssRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  //studentRef: AngularFireObject<any>;
  users;

  userRef: AngularFirestoreCollection<User> = null;
  userRefName: AngularFirestoreCollection<User> = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.userRef = this.db.collection<User>('usuario');
    this.userRefName = this.db.collection<User>('usuario');
  }

  getAll(): AngularFirestoreCollection<User> {
    return this.userRef;
  }

  getByName(): AngularFirestoreCollection<User> {
    return this.userRefName;
  }

  create(user: User): any {
    return this.userRef.add({ ...user });
  }

  update(id: string, data: any): Promise<void> {
    return this.userRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.userRef.doc(id).delete();
  }
}
