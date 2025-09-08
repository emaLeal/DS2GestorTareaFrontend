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
import { AuthService } from '../../authentication/auth.service';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'To do' | 'in-progress' | 'completed';
  priority?: string;
  findAt?: string;
  closedAt?: string;
  user?: number;
  user_name?: string;
  created_by?: number;
  created_by_name?: string;
  updated_by?: number;
  updated_by_name?: string;
  created_at?: string;
  updated_at?: string;
  is_active?: boolean;
  tags?: string[];
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
  private departmentUserIds: number[] = []; // IDs de usuarios del departamento

  constructor(
    private _router: Router,
    private _searchService: SearchService,
    private _taskService: TaskService,
    private _taskFlowService: TaskFlowService,
    private _authService: AuthService
  ) { }

  ngOnInit(): void {
    // Cargar tareas iniciales
    this.loadDepartmentUsersAndTasks();
    this.filteredTasks = [...this.tasks];

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

  // Cargar usuarios del departamento y luego las tareas
  loadDepartmentUsersAndTasks(): void {
    const user = this._authService.getProfile();
    const isManager = user && (user.role_id === 1 || user.role_id === '1');
    
    if (isManager) {
      // Usar directamente la solución temporal (sin intentar el endpoint que no existe)
      console.log('Gerente detectado, usando filtro por departamento...');
      this.departmentUserIds = [];
      this.loadTasksWithDepartmentFilter();
    } else {
      // Para usuarios no gerentes, cargar todas las tareas
      this.departmentUserIds = [];
      this.loadTasks();
    }
  }

  // Cargar tareas con filtros del backend
  loadTasks(): void {
    const filters: any = {};
    
    this._taskService.getAllTasks(filters).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res)
          ? res
          : (res?.results || res?.data || res?.items || []);
        let allTasks = (list as any[]).map((task: any) => task);
        
        // Si es gerente, filtrar por usuarios del departamento
        if (this.departmentUserIds.length > 0) {
          console.log('=== FILTRO POR DEPARTAMENTO (usando lista de usuarios) ===');
          console.log('IDs de usuarios del departamento:', this.departmentUserIds);
          
          allTasks = allTasks.filter((task: any) => {
            const matches = this.departmentUserIds.includes(task.created_by);
            console.log(`Tarea "${task.title}" (creada por ${task.created_by_name} - ID: ${task.created_by}): ${matches ? 'SÍ' : 'NO'}`);
            return matches;
          });
        }
        
        this.tasks = allTasks;
        this.filteredTasks = [...this.tasks];
        this.initCharts();
        this.loadTasksChartByUser();
        this.applyFilters();
      }, error: (err) => {
        console.log(err)
      }
    })
  }

  // Solución temporal: filtrar por departamento usando nombres de usuarios conocidos
  loadTasksWithDepartmentFilter(): void {
    const user = this._authService.getProfile();
    const filters: any = {};
    
    // Mapeo temporal de usuarios por departamento (hasta que el backend exponga esta info)
    const departmentUsers: { [key: number]: string[] } = {
      1: ['Emanuel'], // Departamento 1
      2: ['Hernan', 'Usuario2'], // Departamento 2 - agregar más usuarios según sea necesario
      3: ['Usuario3'], // Departamento 3 - agregar usuarios según sea necesario
    };
    
    this._taskService.getAllTasks(filters).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res)
          ? res
          : (res?.results || res?.data || res?.items || []);
        let allTasks = (list as any[]).map((task: any) => task);
        
        console.log('=== FILTRO POR DEPARTAMENTO (solución temporal) ===');
        console.log('Departamento del usuario:', user.department_id);
        console.log('Usuarios del departamento:', departmentUsers[user.department_id]);
        
        // Filtrar por nombres de usuarios del departamento
        allTasks = allTasks.filter((task: any) => {
          const userName = task.created_by_name;
          const departmentUserNames = departmentUsers[user.department_id] || [];
          const matches = departmentUserNames.includes(userName);
          
          console.log(`Tarea "${task.title}" (creada por ${userName}): ${matches ? 'SÍ' : 'NO'}`);
          return matches;
        });
        
        console.log(`Tareas filtradas: ${allTasks.length} de ${list.length}`);
        
        this.tasks = allTasks;
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
    // Si hay filtros activos, recargar desde el backend con los filtros
    const hasFilters = this.filterStatus || this.filterPriority || this.filterTag || this.filterStartDate || this.filterEndDate;
    
    if (hasFilters) {
      this.loadTasksWithFilters();
    } else {
      // Si no hay filtros, usar filtrado local
      this.filteredTasks = this.tasks.filter((task) => {
        const titleOk = this.searchTerm ? task.title.toLowerCase().includes(this.searchTerm) : true;
        return titleOk;
      });
    }
  }

  private loadTasksWithFilters(): void {
    const filters: any = {};
    
    // Filtros del backend
    if (this.filterStatus) filters.status = this.filterStatus;
    if (this.filterPriority) filters.priority = this.filterPriority;
    if (this.filterTag) filters.tag = this.filterTag;
    
    this._taskService.getAllTasks(filters).subscribe({
      next: (res: any) => {
        const list = Array.isArray(res)
          ? res
          : (res?.results || res?.data || res?.items || []);
        let allTasks = (list as any[]).map((task: any) => task);
        
        // Si es gerente, filtrar por usuarios del departamento
        if (this.departmentUserIds.length > 0) {
          allTasks = allTasks.filter((task: any) => {
            return this.departmentUserIds.includes(task.created_by);
          });
        }
        
        this.tasks = allTasks;
        
        // Aplicar filtros de fecha localmente (ya que el backend no los soporta aún)
        this.filteredTasks = this.tasks.filter((task) => {
          const taskDateStr = task.created_at || task.findAt;
          const taskYmd = this.extractYmd(taskDateStr);
          const startYmd = this.filterStartDate || '';
          const endYmd = this.filterEndDate || '';
          
          const startOk = startYmd ? taskYmd >= startYmd : true;
          const endOk = endYmd ? taskYmd <= endYmd : true;
          const titleOk = this.searchTerm ? task.title.toLowerCase().includes(this.searchTerm) : true;
          
          return startOk && endOk && titleOk;
        });
        
        this.initCharts();
        this.loadTasksChartByUser();
      }, error: (err) => {
        console.log(err)
      }
    });
  }

  clearFilters(): void {
    this.filterStatus = '';
    this.filterPriority = '';
    this.filterTag = '';
    this.filterStartDate = undefined;
    this.filterEndDate = undefined;
    // Recargar tareas sin filtros
    this.loadTasks();
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

