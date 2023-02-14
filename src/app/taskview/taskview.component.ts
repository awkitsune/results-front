import { Component, Input, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { FilesService } from '../_services/files.service';
import { TaskanswersService } from '../_services/taskanswers.service';
import { TasksService } from '../_services/tasks.service';
import { TokenStorageService } from '../_services/token-storage.service';

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
  lastUploadedId = ""
  lastResultPresent: any

  constructor(
    private taskanswersService: TaskanswersService,
    private tasksService: TasksService,
    private filesService: FilesService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    
  }

  ngOnChanges(): void {
    this.fileUploadFailed = false

    if (this.selTaskId) {
      this.tasksService.getTaskById(this.selTaskId).subscribe({
        next: (data) => {
          if (data == 'null') data = "{}"
          else this.task = JSON.parse(data)
        },
        error: (err) => {
          this.task = JSON.parse(err.error).message
        }
      })

      this.updateResultData()
    }
  }

  onFileUpload(event: any): void {
    var uploadedFileId = ""

    this.filesService.uploadFile(this.selectedFile).subscribe({
      next: (data) => {
        uploadedFileId = data
        this.fileUploadFailed = false

        this.taskanswersService.addAnswer(
          this.tokenStorageService.getUser().id,
          this.selTaskId,
          uploadedFileId)
          .subscribe({
          next: (data) => {
            this.fileUploadFailed = false
            this.updateResultData()
          },
          error: (err) => {
            this.fileUploadFailed = true
          }
        })
      },
      error: (err) => {
        this.fileUploadFailed = true
      }
    })   
  }

  updateResultData() {
    this.taskanswersService.filteredList(
      this.tokenStorageService.getUser().id,
      this.selTaskId).subscribe({
        next: (data) => {
          this.lastResultPresent = data
          if (data.length == 0) this.lastResultPresent = false
        },
        error: (err) => {
          this.task = JSON.parse(err.error).message
        }
    })
  }

  onFileChange(event: any): void {
    this.selectedFile = event.target.files[0]
  }

  getMarkTextFromNum(number: Number): string {
    if (number < 0.0) return 'Попытка не оценена'
    return number.toString()
  }
}
