import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Subscription } from 'rxjs';
import { SearchService } from '../../services/search.service';

// Importar Chart.js
import { Chart } from 'chart.js/auto';
import { TaskFlowService } from '../../services/taskflow.service';
import { TaskService } from '../../services/task.service';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'To do' | 'in-progress' | 'completed';
  createdAt: Date;
  created_by_name?: string;
  created_at?: string;
  updated_by_name?: string;
  updated_at?: string;
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

  // Filtros tablero
  filterStatus: '' | 'To do' | 'in-progress' | 'completed' = '';
  filterPriority: '' | 'low' | 'medium' | 'high' = '';
  filterTag: string = '';
  filterStartDate?: string;
  filterEndDate?: string;

  private taskSubscription?: Subscription;

  constructor(
    private _router: Router,
    private _searchService: SearchService,
    private _taskService: TaskService,
    private _taskFlowService: TaskFlowService
  ) { }

  ngOnInit(): void {
    // Cargar tareas iniciales
    this.loadMockTasks();
    this.filteredTasks = [...this.tasks];

    // FUTURO: Aquí se conectará con el backend para obtener tareas
    // this.taskService.getTasks().subscribe(data => this.tasks = data);


    this._searchService.search$.subscribe((term) => {
      this.searchTerm = term;
      this.applyFilters();
    });
  }

  changeStatus(task: Task) {
    console.log("Changing status for task:", task);

    const nextStatus = task.status === 'To do' ? 'in-progress' :
      task.status === 'in-progress' ? 'completed' : 'To do';
    task.status = nextStatus;
    this._taskFlowService.updateTask(task.id, task).subscribe();
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
        const list = Array.isArray(res)
          ? res
          : (res?.results || res?.data || res?.items || []);
        this.tasks = (list as any[]).map((task: any) => task);
        this.filteredTasks = [...this.tasks];
        this.initCharts();
        this.loadTasksChartByUser();
        this.applyFilters();
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  // Filtrar por estado
  getTasksByStatus(status: 'To do' | 'in-progress' | 'completed') {
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
  // FILTROS (tablero)
  // ==========================
  private extractYmd(s?: string) { return s ? s.slice(0, 10) : ''; }

  applyFilters(): void {
    this.filteredTasks = this.tasks.filter((task) => {
      const statusOk = this.filterStatus ? task.status === this.filterStatus : true;
      const priorityOk = this.filterPriority ? (task as any).priority === this.filterPriority : true;
      const tagOk = this.filterTag
        ? ((task as any).tags || []).some((t: string) => t.toLowerCase().includes(this.filterTag.toLowerCase()))
        : true;

      // Usar el campo correcto para fechas (created_at es el que se muestra en el template)
      const taskDateStr = (task as any).created_at || (task as any).createdAt || (task as any).findAt;
      const taskYmd = this.extractYmd(taskDateStr);
      const startYmd = this.filterStartDate || '';
      const endYmd = this.filterEndDate || '';
      
      // Debug: mostrar qué fecha está usando cada tarea
      if (startYmd && taskYmd) {
        console.log(`Tarea "${task.title}": fecha=${taskYmd}, filtro desde=${startYmd}, cumple=${taskYmd >= startYmd}`);
      }
      
      const startOk = startYmd ? taskYmd >= startYmd : true;
      const endOk = endYmd ? taskYmd <= endYmd : true;

      const titleOk = this.searchTerm ? task.title.toLowerCase().includes(this.searchTerm) : true;
      return statusOk && priorityOk && tagOk && startOk && endOk && titleOk;
    });
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterTag = '';
    this.filterStartDate = undefined;
    this.filterEndDate = undefined;
    this.applyFilters();
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this._taskFlowService.deleteTask(task.id).subscribe();

    this.filteredTasks = [...this.tasks];
    this.openTaskId = null;
  }


  // ==========================
  // ESTADÍSTICAS Y GRÁFICOS
  // ==========================
  initCharts(): void {
    // Conteos simulados (aquí luego conectas con backend)
    const totalTodo = this.tasks.filter((t) => t.status === 'To do').length;
    const totalProgress = this.tasks.filter((t) => t.status === 'in-progress').length;
    const totalCompleted = this.tasks.filter((t) => t.status === 'completed').length;
    console.log(totalTodo, totalProgress, totalCompleted);

    console.log("Totales - To do:", totalTodo, "In Progress:", totalProgress, "Completed:", totalCompleted);

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
      options: {
        responsive: true,
        maintainAspectRatio: false,
        layout: { padding: 0 },
        plugins: {
          legend: {
            position: 'left',
            labels: {
              usePointStyle: true,
              pointStyle: 'rect',
              boxWidth: 12,
              padding: 12,
              color: '#6b7280',
              font: { size: 11 }
            }
          }
        }
      }
    });

  }
  loadTasksChartByUser() {
    const userCounts: { [key: string]: number } = {};

    this.tasks.forEach(task => {
      const user = task.created_by_name || 'Sin asignar';
      userCounts[user] = (userCounts[user] || 0) + 1;
    });

    const labels = Object.keys(userCounts);
    const data = Object.values(userCounts);

    this.renderUserChart(labels, data);
  }
  renderUserChart(labels: string[], data: number[]) {
    const ctx = document.getElementById('userChart') as HTMLCanvasElement;

    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [
          {
            data: data,
            backgroundColor: [
              '#3b82f6', // Azul
              '#f97316', // Naranja
              '#10b981', // Verde
              '#f43f5e', // Rojo
              '#6366f1', // Indigo
              '#14b8a6'  // Teal
            ],
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: '#374151',
              font: {
                size: 12
              }
            }
          }
        }
      }
    });
  }

}

