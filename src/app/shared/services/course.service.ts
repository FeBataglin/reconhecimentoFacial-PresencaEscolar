import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Course } from '../models/course/course.model';
import { AngularFireDatabase, AngularFireList, AngularFireObject } from '@angular/fire/database';
import { Instituition } from '../models/Instituition/instituition.model';

@Injectable({
  providedIn: 'root'
})
export class CourseService {

  courseRef: AngularFirestoreCollection<Course> = null;
  instituitionRef: AngularFirestoreCollection<Course> = null;

  constructor(private db: AngularFirestore, private fb: AngularFireDatabase) {
    this.courseRef = this.db.collection<Course>('curso', ref => ref.orderBy('nome', 'asc'));
  }

  getAll(): AngularFirestoreCollection<Course> {
    return this.courseRef;
  }

  create(disciplines: Course): any {
    return this.courseRef.add({ ...disciplines });
  }

  update(id: string, data: any): Promise<void> {
    return this.courseRef.doc(id).update(data);
  }

  delete(id: string): Promise<void> {
    return this.courseRef.doc(id).delete();
  }

}
