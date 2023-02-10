import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const ANSWERS_API = 'http://localhost:8080/api/task/answer/';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable({
  providedIn: 'root'
})
export class TaskanswersService {

  constructor(private http: HttpClient) {  }

  addAnswer(userId: String, taskId: String, file: String): Observable<any> {
    return this.http.post(ANSWERS_API + "add", {
      user: {
        id: userId
      },
      task: {
        id: taskId
      },
      file
    }, httpOptions )
  }

  checkAnswerExistence(userId: String, taskId: String): Observable<any> {
    return this.http.post(ANSWERS_API + "exists", {
      userId,
      taskId
    }, httpOptions )
  }
}
