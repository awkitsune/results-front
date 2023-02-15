import { Component, Input, OnInit } from '@angular/core';
import { switchScan } from 'rxjs';
import { FilesService } from '../_services/files.service';
import { TaskanswersService } from '../_services/taskanswers.service';
import { TasksService } from '../_services/tasks.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-board-admin',
  templateUrl: './board-admin.component.html',
  styleUrls: ['./board-admin.component.css']
})
export class BoardAdminComponent implements OnInit {

  allowChangeResult = false
  taskAnswersList: any
  content = ""
  usersGrouped: any
  tasksList: any
  maxTrimmedLength = 120
  
  constructor( 
    private taskAnswersService: TaskanswersService,
    private tasksService: TasksService,
    private filesService: FilesService) { }

  ngOnInit(): void {
    this.taskAnswersService.getAnswersList().subscribe({
      next: (data) => {
        this.taskAnswersList = data

        this.usersGrouped = [...new Set(this.taskAnswersList.map(item => item.user.id))]
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message
      }
    })

    this.tasksService.getTasksList().subscribe({
      next: (data) => {
        this.tasksList = JSON.parse(data)
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message
      }
    })
  }

  onAnswerClick(event: any) {
    const a = document.createElement('a')
    a.href = this.filesService.downloadFile(event.target.id)
    a.download = 'answer_' + event.target.id + '.zip'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  onMarkClick(event: any) {
    var mark = parseInt(
      prompt(
        'Оценка ответа ' + event.target.id, 
        this.taskAnswersList.find(x =>  x.id == event.target.id).mark
      ))

    if (mark >= -1 && mark <= 99) {
      this.taskAnswersService.updateAnswer(event.target.id, mark).subscribe({
        next: (data) => {
          alert(data.message)
        },
        error: (err) => {
          alert(err)
        }
      })
    }
    else {
      alert('Проверьте правильность введёного балла\n\n' +
      'Ожидалось mark[-1..99] , получено ' + mark)
    }
  }

  getMarkTextFromNum(number: Number): string {
    if (number < 0.0) return 'Попытка не оценена'
    return number.toString()
  }

  getMarkNumFromNum(number: number): number {
    if (number < 0.0) return 0.0
    return number
  }
  
  getUserById(id: string) : string {
    return this.taskAnswersList.find(x => x.user.id == id).user.username
  }

  getTaskMark(taskId: string, userId: string): number {
    var compatAnswers = this.taskAnswersList.filter(answer =>
      answer.user.id == userId &&
      answer.task.id == taskId
    )
    return this.getMarkNumFromNum(Math.max(...compatAnswers.map(answer => answer.mark)))
  }

  getTaskMarkSum(userId: string): number {
    var compatUserAnswers: Array<any> = this.taskAnswersList.filter(answer =>
      answer.user.id == userId 
      )

    var sum = 0.0
    var lastTaskId = ''
    var currentMax = 0.0

    if(compatUserAnswers) {
      compatUserAnswers.forEach(element => {
        if(element.task.id != lastTaskId) {
          sum +=this.getTaskMark(element.task.id, userId)
          lastTaskId = element.task.id
        }
      });
    }

    return sum
  }

  trimString(str: string): string {
    var newStr = str.substring(0, this.maxTrimmedLength);
    return newStr.substring(0, Math.min(newStr.length, newStr.lastIndexOf(" "))) + '...'
  }
}