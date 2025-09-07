import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { SearchService } from '../../services/search.service';
import { NgZone } from '@angular/core';
import { ChangeDetectorRef } from '@angular/core';
import { TaskFlowService } from '../../services/taskflow.service';


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
  status: 'To do' | 'in-progress' | 'completed';
  createdAt: string; // ISO string
  findAt: string
  closedAt?: string; // <-- NUEVO: fecha de cierre opcional
  user?: number;
  priority: string, // ✅ nueva propiedad
  tags: string[]; // ✅ nueva propiedad
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
    status: 'To do',
    createdAt: '',
    findAt: '',
    closedAt: '',// <-- agregado
    priority: 'medium', // ✅ nueva propiedad
    tags: []
  };

  // Drag data para mover la tarea 
  private draggedTaskId: number | null = null;

  // Simulated auto-increment id
  private nextId = 100;

  constructor(
    private router: Router, 
    private searchservice: SearchService, 
    private cdr: ChangeDetectorRef,
    private taskflowService: TaskFlowService,
  ) { }

  ngOnInit(): void {
    this.loadTasksFromBackend(); // carga inicial (simulada)
    this.filteredTasks = [...this.tasks];
    this.searchservice.search$.subscribe((term: string) => {
      this.filteredTasks = this.tasks.filter((t) =>
        t.title.toLowerCase().includes(term.toLowerCase())
      );
    });
  }

  tagsInput: string = '';

addTag() {
  console.log("Adding tag:", this.currentTask.tags);

  const newTag = this.tagsInput.trim();

  if (newTag !== '') {
    // Crear un nuevo array con el tag nuevo
    this.currentTask.tags = [...(this.currentTask.tags || []), newTag];

    // Eliminar duplicados
    this.currentTask.tags = [...new Set(this.currentTask.tags)];

    // Limpiar el input
    this.tagsInput = '';
  }
}

  removeTag(index: number) {
    this.currentTask.tags?.splice(index, 1);
  }

  // -------------------------
  // CONECCION CON BACKEND 
  // -------------------------
  // 1) loadTasksFromBackend:
  //    Aquí se debe reemplazar la simulación por: this.tasksService.getTasks().subscribe(...) cuando este el backend
  loadTasksFromBackend() {
    console.log("TaskFlow - Cargando tareas (simulado)...");

    const saved = localStorage.getItem('taskflow_tasks_v1');
    this.taskflowService.getTaskFlow().subscribe({
        next: (data: any) => {
          this.tasks = data; // ✅ Guardar en la variable del componente
          this.filteredTasks = [...this.tasks]; // Actualizar la lista filtrada
          console.log("Tasks cargadas en el componente:", this.tasks);
          
        },
        error: (err) => {
          console.error("Error al obtener tareas:", err);
        }
      })

  }

  // 2) saveTaskToBackend(task)
  //    Reemplaza la simulación por: this.tasksService.createTask(task).subscribe(...)
  private saveTaskToBackend(task: Task) {
    console.log("TaskFlow - Guardando tarea (simulado):", task);
    this.taskflowService.createTask(task).subscribe({
        next: (data: any) => {
          console.log("Tarea creada en backend:", data);
          
          this.tasks = [...this.tasks,data]; // ✅ Guardar en la variable del componente
          this.filteredTasks = [...this.tasks]; // Actualizar la lista filtrada
          
        },
        error: (err) => {
          console.error("Error al obtener tareas:", err);
        }
    });
  }

  // 3) updateTaskBackend(task)
  //    Reemplaza por: this.tasksService.updateTask(task).subscribe(...)
  private updateTaskBackend(task: Task) {
    const idx = this.tasks.findIndex(t => t.id === task.id);
    if (idx > -1) {
      console.log("TaskFlow - Actualizando tarea (simulado):", task);
      
      this.taskflowService.updateTask(task.id, task).subscribe();
      this.tasks[idx] = { ...task };
      this.filteredTasks = [...this.tasks];
      this.persistLocal();
    }
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id;
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
      status: 'To do',
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
      status: (this.currentTask.status as Task['status']) || 'To do',
      createdAt: new Date(this.currentTask.createdAt!).toISOString(),
      findAt: new Date(this.currentTask.createdAt!).toISOString(),
      closedAt: this.currentTask.closedAt ? new Date(this.currentTask.closedAt).toISOString() : '', // <-- 
      user: 1, //<- cambiar por el usuario loggeado
      priority: this.currentTask.priority || 'medium', 
      tags: this.currentTask.tags || [],
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
    console.log("onDrop - idStr:", idStr);
    
    const id = idStr ? parseInt(idStr, 10) : this.draggedTaskId;
    if (!id) return;
    const task = this.tasks.find(t => t.id === id);

    console.log("Task arrastrada:", task);


    if (!task) return;

    // if (task.status === status) return; // nada que hacer

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
    task.status = 'To do';
    // task.closedAt = ''; // <-- limpiar fecha de cierre al reabrir
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
    this.taskflowService.deleteTask(task.id).subscribe();
    console.log("TaskFlow - Tarea eliminada:", task);
    
    this.filteredTasks = [...this.tasks];
    this.openTaskId = null;
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

  formatDate(iso?: string) {
    if (!iso) return '';
    const d = new Date(iso);
    return d.toLocaleDateString();
  }
}
