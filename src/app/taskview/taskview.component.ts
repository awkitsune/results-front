import { Component, Input, OnInit } from '@angular/core';
import { FilesService } from '../_services/files.service';
import { TaskanswersService } from '../_services/taskanswers.service';
import { TasksService } from '../_services/tasks.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-taskview',
  templateUrl: './taskview.component.html',
  styleUrls: ['./taskview.component.css']
})
export class TaskviewComponent implements OnInit {

  @Input() selTaskId = ""

  task: any
  selectedFile: any
  fileUploadFailed = false
  canUploadFile = false

  constructor(
    private taskanswersService: TaskanswersService,
    private tasksService: TasksService,
    private filesService: FilesService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    this.tasksService.getTaskById(this.selTaskId).subscribe({
      next: (data) => {
        if (data == 'null') data = ''
        else this.task = JSON.parse(data)
      },
      error: (err) => {
        this.task = JSON.parse(err.error).message
      }
    })

    this.taskanswersService.checkAnswerExistence(
      this.tokenStorageService.getUser().id,
      this.selTaskId)
      .subscribe({
      next: (data) => {
        console.log(data)
        this.canUploadFile = data
        this.canUploadFile = !this.canUploadFile
      },
      error: (err) => {
        this.task = JSON.parse(err.error).message
      }
    })
  }

  onFileUpload(event: any): void {
    var uploadedFileId = ""

    this.filesService.uploadFile(this.selectedFile).subscribe({
      next: (data) => {
        uploadedFileId = data
        this.fileUploadFailed = false
      },
      error: (err) => {
        this.fileUploadFailed = true
      }
    })

    if (!this.fileUploadFailed){
      this.taskanswersService.addAnswer(
        this.tokenStorageService.getUser().id,
        this.selTaskId,
        uploadedFileId)
        .subscribe({
        next: (data) => {
          console.log(data)
          this.fileUploadFailed = false
        },
        error: (err) => {
          this.fileUploadFailed = true
        }
      })
    }
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  downloadAnswer() {
    this.filesService.downloadFile(this.selTaskId).subscribe({
      next: (data) => {

      },
      error: (err) => {
        
      }
    })
  }
}
