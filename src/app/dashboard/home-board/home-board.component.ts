import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: Date;
}

@Component({
  selector: 'app-home-board',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './home-board.component.html',
  styleUrls: ['./home-board.component.css'],
})
export class HomeBoardComponent implements OnInit, OnDestroy {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  isMenuOpen = false;
  showSearchResults = false;

  private taskSubscription?: Subscription;

  constructor(private router: Router 
    , private searchService: SearchService
  ) {}

  ngOnInit(): void {
    // Cargar tareas iniciales
    this.loadMockTasks();
    this.filteredTasks = [...this.tasks];
    this.searchService.search$.subscribe(term => {
    this.filteredTasks = this.tasks.filter((t) =>
      t.title.toLowerCase().includes(term)
    );
  });
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  // Mock de tareas
  loadMockTasks(): void {
    this.tasks = [
      { id: 1, title: "Attend Nischal's Birthday Party", status: 'todo', createdAt: new Date() },
      { id: 2, title: 'Landing Page Design for TravelDays', status: 'todo', createdAt: new Date() },
      { id: 3, title: 'Presentation on Final Product', status: 'todo', createdAt: new Date() },
      { id: 4, title: 'GYM', status: 'in-progress', createdAt: new Date() },
      { id: 5, title: 'Walk the dog', status: 'completed', createdAt: new Date() },
      { id: 6, title: 'Conduct meeting', status: 'completed', createdAt: new Date() },
    ];
  }

  // Filtrar por estado
  getTasksByStatus(status: 'todo' | 'in-progress' | 'completed') {
    return this.filteredTasks.filter((t) => t.status === status);
  }

  // Buscar tareas
  onSearch(event: any): void {
    const term = event.target.value.toLowerCase();
    this.searchTerm = term;
    if (term.trim() === '') {
      this.filteredTasks = [...this.tasks];
      return;
    }
    this.filteredTasks = this.tasks.filter((t) =>
      t.title.toLowerCase().includes(term)
    );
    this.showSearchResults = true;
  }

  // Toggle menú usuario
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Cerrar sesión
  logout(): void {
    console.log('Cerrar sesión');
    // TODO: implementar logout real
    this.router.navigate(['/login']);
  }

  // Agregar tarea demo
  addTask(): void {
    const newTask: Task = {
      id: this.tasks.length + 1,
      title: 'Nueva tarea ' + (this.tasks.length + 1),
      status: 'todo',
      createdAt: new Date(),
    };
    this.tasks.push(newTask);
    this.filteredTasks = [...this.tasks];
  }
}
