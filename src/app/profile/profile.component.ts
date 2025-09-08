import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

interface User {
  first_name: string;
  last_name: string;
  email: string;
  document_id: string;
  identification_type: string;
  role_description: string;
  department_name: string;
  department_id: number;

}

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, RouterModule],
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user!: User | null;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.loadUserFromLocalStorage();
  }

  // cargar el usuario desde localStorage
  loadUserFromLocalStorage(): void {
    const userData = localStorage.getItem('user');

    if (userData && userData !== 'undefined') {
      try {
        this.user = JSON.parse(userData);
      } catch (e) {
        console.error("Error al parsear user_data:", e);
        this.user = null;
      }
    } else {
      this.user = null;
    }
  }
}
