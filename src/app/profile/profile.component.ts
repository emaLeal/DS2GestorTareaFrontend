import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';


interface User {
  name: string ; 
  last_name: string;
  email: string ; 
  identification_type: string; 
  id: number;
  departaments: string;
  rol: string
}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent implements OnInit {

   constructor(private router: Router) {}
  user!: User;

  ngOnInit(): void {
    this.loadMockUser();
  }

  // simulacion de datos de usuario 
  loadMockUser(): void {
    this.user= {
        name: "karen daniela", 
        last_name: "guzman h", 
        email: "karenh99@gamil.com", 
        identification_type: "Cedula", 
        id: 1145667890, 
        departaments: "tecnologia", 
        rol: "usuario" 
      };
  }

}
