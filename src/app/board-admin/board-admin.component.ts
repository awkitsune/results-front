import { Component, Input, OnInit } from '@angular/core';
import { FilesService } from '../_services/files.service';
import { TaskanswersService } from '../_services/taskanswers.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  taskAnswersList: any
  content = ""

  constructor( 
    private taskAnswersService: TaskanswersService,
    private filesService: FilesService) { }

  ngOnInit(): void {
    this.taskAnswersService.getAnswersList().subscribe({
      next: (data) => {
        this.taskAnswersList = data
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message
      }
    })
  }

  onAnswerClick(event: any) {
    console.log(this.filesService.downloadFile(event.target.id))
    const a = document.createElement('a')
    a.href = this.filesService.downloadFile(event.target.id)
    a.download = 'answer_' + event.target.id + '.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

}
