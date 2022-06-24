import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import * as firebase from 'firebase'
import { Upload } from './../../shared/models/students/upload.model';

@Injectable({
  providedIn: 'root'
})
export class UploadService {
  
  constructor(private _http:HttpClient){}

}
