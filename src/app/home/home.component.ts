import { Component, OnInit } from '@angular/core';
import { TasksService } from '../_services/tasks.service';
import { TokenStorageService } from '../_services/token-storage.service';
import { UserService } from '../_services/user.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  tasksList: any
  isLoggedIn = false
  content?: string;
  selectedTaskId: any
  maxTrimmedLength = 120

  constructor(
    private userService: UserService,
    private tasksService: TasksService,
    private tokenStorageService: TokenStorageService) { }

  ngOnInit(): void {
    this.isLoggedIn = !!this.tokenStorageService.getToken()

    this.userService.getPublicContent().subscribe({
      next: (data) => {
        this.content = data
      },
      error: (err) => {
        this.content = JSON.parse(err.error).message
      }
    })

    if (this.isLoggedIn) {
      this.tasksService.getTasksList().subscribe({
        next: (data) => {
          this.tasksList = JSON.parse(data)
        },
        error: (err) => {
          this.content = JSON.parse(err.error).message
        }
      })
    }

  }

  onTaskClick(event: any): void {
    this.selectedTaskId = event.target.id
  }

  trimString(str: string): string {
    var newStr = str.substring(0, this.maxTrimmedLength);
    return newStr.substring(0, Math.min(newStr.length, newStr.lastIndexOf(" "))) + '...'
  }

}
