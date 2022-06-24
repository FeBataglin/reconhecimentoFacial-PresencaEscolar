import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Student } from './../models/students/student.model';
import { FormControl, FormGroup } from "@angular/forms";
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';

@Injectable({
  providedIn: 'root'
})
export class StudentService {

  studentsRef: AngularFireList<any>;    // Reference to Student data list, its an Observable
  //studentRef: AngularFireObject<any>;
  students;

  studentRef: AngularFirestoreCollection<Student> = null;
  studentRefName: AngularFirestoreCollection<Student> = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.studentRef = this.db.collection<Student>('aluno', ref => ref.orderBy('time', 'asc'));
    this.studentRefName = this.db.collection<Student>('aluno', ref => ref.orderBy('nome', 'asc'));
  }

  getAll(): AngularFirestoreCollection<Student> {
    return this.studentRef;
  }

  getByName(): AngularFirestoreCollection<Student> {
    return this.studentRefName;
  }

  create(student: Student): any {
    return this.studentRef.add({ ...student });
  }

  update(id: string, data: any): Promise<void> {
    return this.studentRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.studentRef.doc(id).delete();
  }

}
