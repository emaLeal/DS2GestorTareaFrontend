import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';

// Importar Chart.js
import { Chart } from 'chart.js/auto';
import { TaskService } from '../../services/task.service';

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
export class HomeBoardComponent implements OnInit, OnDestroy, AfterViewInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  isMenuOpen = false;
  showSearchResults = false;

  private taskSubscription?: Subscription;

  constructor(
    private _router: Router,
    private _searchService: SearchService,
    private _taskService: TaskService
  ) { }

  ngOnInit(): void {
    // Cargar tareas iniciales
    this.loadMockTasks();
    this.filteredTasks = [...this.tasks];

    // FUTURO: Aquí se conectará con el backend para obtener tareas
    // this.taskService.getTasks().subscribe(data => this.tasks = data);


    this._searchService.search$.subscribe((term) => {
      this.filteredTasks = this.tasks.filter((t) =>
        t.title.toLowerCase().includes(term)
      );
    });
  }

  ngAfterViewInit(): void {
    this.initCharts(); // Inicializar gráficos después de renderizar la vista
  }

  ngOnDestroy(): void {
    if (this.taskSubscription) {
      this.taskSubscription.unsubscribe();
    }
  }

  openTaskId: number | null = null;

  toggleTaskOptions(task: any) {
    this.openTaskId = this.openTaskId === task.id ? null : task.id;
  }

  // simula carga de tareas hasta que no haya backend 
  loadMockTasks(): void {
    this._taskService.getAllTasks().subscribe({
      next: (res: any) => {
        this.tasks = res.map((task: any) => task)
      }, error: (err) => {
        console.log(err)
      }
    })
    // this.tasks = [
    //   { id: 1, title: "Attend Nischal's Birthday Party", status: 'todo', createdAt: new Date() },
    //   { id: 2, title: 'Landing Page Design for TravelDays', status: 'todo', createdAt: new Date() },
    //   { id: 3, title: 'Presentation on Final Product', status: 'todo', createdAt: new Date() },
    //   { id: 4, title: 'GYM', status: 'in-progress', createdAt: new Date() },
    //   { id: 5, title: 'Walk the dog', status: 'completed', createdAt: new Date() },
    //   { id: 6, title: 'Conduct meeting', status: 'completed', createdAt: new Date() },
    // ];
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
    this._router.navigate(['/login']);
  }

  // ==========================
  // ESTADÍSTICAS Y GRÁFICOS
  // ==========================
  initCharts(): void {
    // Conteos simulados (aquí luego conectas con backend)
    const totalTodo = this.tasks.filter((t) => t.status === 'todo').length;
    const totalProgress = this.tasks.filter((t) => t.status === 'in-progress').length;
    const totalCompleted = this.tasks.filter((t) => t.status === 'completed').length;
    console.log(totalTodo, totalProgress, totalCompleted)
    // Gráfico circular por estado
    new Chart('statusChart', {
      type: 'doughnut',
      data: {
        labels: ['Por hacer', 'En progreso', 'Completadas'],
        datasets: [
          {
            data: [totalTodo, totalProgress, totalCompleted],
            backgroundColor: ['#f87171', '#facc15', '#4ade80'],
          },
        ],
      },
    });

    // Gráfico de completadas por semana (simulado)
    new Chart('weeklyChart', {
      type: 'bar',
      data: {
        labels: ['Semana 1', 'Semana 2', 'Semana 3', 'Semana 4'],
        datasets: [
          {
            label: 'Finalizadas',
            data: [2, 5, 3, 6], // Simulado, luego traer del backend
            backgroundColor: '#4f46e5',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: { legend: { display: false } },
      },
    });
  }
}
