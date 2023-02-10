import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const FILES_API = 'http://localhost:8080/api/file/';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(private http: HttpClient) { }

  uploadFile(file: Blob): Observable<any> {
    var formData = new FormData()
    formData.append("File", file)

    return this.http.post(FILES_API + "upload", formData)
  }

  downloadFile(id: String): Observable<any> {
    return this.http.get(FILES_API + "download/" + id )
  }
}
