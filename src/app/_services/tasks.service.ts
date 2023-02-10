import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const API_URL = 'http://localhost:8080/api/task/';

@Injectable({
  providedIn: 'root'
})
export class TasksService {

  constructor(private http: HttpClient) { }

  getTasksList(): Observable<any> {
    return this.http.get(API_URL + 'list', {responseType: 'text'})
  }
  getTaskById(id: String): Observable<any> {
    return this.http.get(API_URL + id, {responseType: 'text'})
  }
}
