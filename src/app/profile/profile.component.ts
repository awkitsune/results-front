import { Component, OnInit } from '@angular/core';
import { TokenStorageService } from '../_services/token-storage.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  currentUser: any;

  constructor(private token: TokenStorageService) { }

  ngOnInit(): void {
    this.currentUser = this.token.getUser()
  }

  roleIdToRusString(id: string) {
    switch(id) {
      case 'ROLE_ADMIN': return 'Администратор'; 
      case 'ROLE_USER': return 'Пользователь'; 
      default: return id;
    }
  }
}
