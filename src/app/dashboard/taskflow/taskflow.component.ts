import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';

/**
 * TaskFlowComponent
 * - HTML + Tailwind in the template below
 * - Uses native Drag & Drop
 * - Simula backend con localStorage hasta que conectes tu servicio real
 *
 * Dónde conectar backend:
 * - loadTasksFromBackend(): -> aquí debes llamar a tu servicio (ej: tasksService.getTasks())
 * - saveTaskToBackend(task): -> aquí debes llamar a tu servicio (ej: tasksService.create(task))
 * - updateTaskBackend(task): -> aquí debes llamar a tu servicio (ej: tasksService.update(task))
 */

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string; // ISO string
  findAt: string
  closedAt?: string; // <-- NUEVO: fecha de cierre opcional
}

@Component({
  selector: 'app-taskflow',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './taskflow.component.html',
  styleUrls: ['./taskflow.component.css'],
})
export class TaskflowComponent implements OnInit {
  tasks: Task[] = []; // 
  isModalOpen = false;
  filteredTasks: Task[] = [];
  searchTerm: string = '';
  isMenuOpen = false;
  showSearchResults = false;
  openTaskId: number | null = null; // <-- controla menú contextual abierto

  // Current editing/creating task
  currentTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    createdAt: '',
    findAt: '',
    closedAt: '' // <-- agregado
  };

  // Drag data para mover la tarea 
  private draggedTaskId: number | null = null;

  // Simulated auto-increment id
  private nextId = 100;

  constructor(private router: Router, private searchservice: SearchService) {}

  ngOnInit(): void {
    this.loadTasksFromBackend(); // carga inicial (simulada)
    this.filteredTasks = [...this.tasks];
    this.searchservice.search$.subscribe((term: string) => {
      this.filteredTasks = this.tasks.filter((t) =>
        t.title.toLowerCase().includes(term.toLowerCase())
      );
    });
  }

  // -------------------------
  // CONECCION CON BACKEND 
  // -------------------------
  // 1) loadTasksFromBackend:
  //    Aquí se debe reemplazar la simulación por: this.tasksService.getTasks().subscribe(...) cuando este el backend
  loadTasksFromBackend() {
    const saved = localStorage.getItem('taskflow_tasks_v1');
    if (saved) {
      this.tasks = JSON.parse(saved);
      // update nextId
      const max = this.tasks.reduce((m, t) => Math.max(m, t.id), 0);
      this.nextId = max + 1;
    } else {
      // mock tasks (igual al ejemplo que mostraste)
      this.tasks = [
        { id: 1, title: "Attend Nischal's Birthday Party", status: 'todo', createdAt: new Date().toISOString(), findAt: new Date().toISOString(), closedAt: '' },
        { id: 2, title: 'Landing Page Design for TravelDays', status: 'todo', createdAt: new Date().toISOString(), findAt: new Date().toISOString(), closedAt: '' },
        { id: 3, title: 'Presentation on Final Product', status: 'todo', createdAt: new Date().toISOString(), findAt: new Date().toISOString(), closedAt: '' },
        { id: 4, title: 'GYM', status: 'in-progress', createdAt: new Date().toISOString(), findAt: new Date().toISOString(), closedAt: '' },
        { id: 5, title: 'Walk the dog', status: 'completed', createdAt: new Date().toISOString(), findAt: new Date().toISOString(), closedAt: new Date().toISOString() },
        { id: 6, title: 'Conduct meeting', status: 'completed', createdAt: new Date().toISOString(), findAt: new Date().toISOString(), closedAt: new Date().toISOString() },
      ];
      this.persistLocal();
    }
  }

  // 2) saveTaskToBackend(task)
  //    Reemplaza la simulación por: this.tasksService.createTask(task).subscribe(...)
  private saveTaskToBackend(task: Task) {
    // SIMULACIÓN: guardamos en localStorage
    this.tasks.push(task);
    this.persistLocal();
    // Si el backend devuelve el recurso creado, usa esa respuesta para actualizar el id/otros campos.
  }

  // 3) updateTaskBackend(task)
  //    Reemplaza por: this.tasksService.updateTask(task).subscribe(...)
  private updateTaskBackend(task: Task) {
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if (idx > -1) {
      this.tasks[idx] = { ...task };
      this.persistLocal();
    }
  }

  // persistencia simulada (local)
  private persistLocal() {
    localStorage.setItem('taskflow_tasks_v1', JSON.stringify(this.tasks));
  }

  // -------------------------
  // UI / CRUD
  // -------------------------
  openCreateModal() {
    this.currentTask = {
      title: '',
      description: '',
      status: 'todo',
      createdAt: new Date().toISOString().slice(0, 10), // yyyy-mm-dd for input[type=date]
      closedAt: '' // <-- inicializar vacía donde finaliza la tarea
    };
    this.isModalOpen = true;
  }

  closeCreateModal() {
    this.isModalOpen = false;
  }

  titleInvalid(form: NgForm | any) {
    return form && form.submitted && (!this.currentTask.title || this.currentTask.title.trim() === '');
  }

  descriptionInvalid(form: NgForm | any) {
    return form && form.submitted && (!this.currentTask.description || this.currentTask.description.trim() === '');
  }

  saveTask(form: NgForm) {
    // validate
    if (!this.currentTask.title || !this.currentTask.description || !this.currentTask.createdAt) {
      return;
    }

    // build Task
    const newTask: Task = {
      id: this.nextId++,
      title: (this.currentTask.title || '').trim(),
      description: (this.currentTask.description || '').trim(),
      status: (this.currentTask.status as Task['status']) || 'todo',
      createdAt: new Date(this.currentTask.createdAt!).toISOString(),
      findAt: new Date(this.currentTask.createdAt!).toISOString(),
      closedAt: this.currentTask.closedAt ? new Date(this.currentTask.closedAt).toISOString() : '' // <-- guardamos fecha cierre si existe
    };

    // Lugar para conectar el backend: saveTaskToBackend (reemplazar)
    this.saveTaskToBackend(newTask);

    // mensaje console (equivalente a MatSnackBar en tu otro componente)
    console.log('TaskFlow - Task creada:', newTask);

    this.isModalOpen = false;
  }

  // -------------------------
  // Drag & Drop para manejar el direccionamiento de la tarea en el tablero 
  // -------------------------
  onDragStart(event: DragEvent, task: Task) {
    this.draggedTaskId = task.id;
    event.dataTransfer?.setData('text/plain', String(task.id));
    event.dataTransfer?.setData('text/task', JSON.stringify(task));
  }

  allowDrop(event: DragEvent) {
    event.preventDefault();
  }

  onDrop(event: DragEvent, status: Task['status']) {
    event.preventDefault();
    const idStr = event.dataTransfer?.getData('text/plain');
    const id = idStr ? parseInt(idStr, 10) : this.draggedTaskId;
    if (!id) return;
    const task = this.tasks.find(t => t.id === id);
    if (!task) return;
    if (task.status === status) return; // nada que hacer

    task.status = status;
    this.updateTaskBackend(task); // punto para conectar update en backend
    this.draggedTaskId = null;
  }

  // marcar completada con botón
  markAsCompleted(task: Task) {
    task.status = 'completed';
    task.closedAt = new Date().toISOString(); // <-- asignamos fecha de cierre
    this.updateTaskBackend(task); // conecta aquí con backend
  }

  reopenTask(task: Task) {
    task.status = 'todo';
    task.closedAt = ''; // <-- limpiar fecha de cierre al reabrir
    this.updateTaskBackend(task);
  }

  // -------------------------
  // Opciones (tres puntitos)
  // -------------------------
  toggleOptions(task: Task, event: Event) {
    event.stopPropagation();
    this.openTaskId = this.openTaskId === task.id ? null : task.id;
  }

  editTask(task: Task) {
    console.log("Editar tarea:", task);
    // ejemplo: navegar a ruta de edición (puedes abrir modal en lugar de esto)
    this.router.navigate(['/dashboard/edit-task'], { queryParams: { id: task.id } });
    this.openTaskId = null;
  }

  deleteTask(task: Task) {
    this.tasks = this.tasks.filter(t => t.id !== task.id);
    this.persistLocal();
    this.filteredTasks = [...this.tasks];
    this.openTaskId = null;
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

  formatDate(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString();
  }
}
