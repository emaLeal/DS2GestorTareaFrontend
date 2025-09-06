import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

interface Task {
  id: number;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'completed';
  createdAt: string;
  findAt: string;
  closedAt?: string;
}

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-task.component.html',
  styleUrls: ['./edit-task.component.css'],
})
export class EditTaskComponent implements OnInit {
  taskId!: number;
  task: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    createdAt: '',
    closedAt: ''
  };

  // Current editing/creating task
  currentTask: Partial<Task> = {
    title: '',
    description: '',
    status: 'todo',
    createdAt: '',
    findAt: '',
    closedAt: '' // <-- agregado
  };


  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    // Obtenemos el id de la URL (queryParam: ?id=123)
    this.route.queryParams.subscribe(params => {
      this.taskId = +params['id']; 
      this.loadTaskFromLocalStorage(this.taskId);
    });
  }
  titleInvalid(form: NgForm | any) {
    return form && form.submitted && (!this.currentTask.title || this.currentTask.title.trim() === '');
  }
  // -------------------------
  // Simulación carga tarea
  // -------------------------
  private loadTaskFromLocalStorage(id: number) {
    const saved = localStorage.getItem('taskflow_tasks_v1');
    if (!saved) return;
    const tasks: Task[] = JSON.parse(saved);
    const found = tasks.find(t => t.id === id);
    if (found) {
      this.task = { ...found }; // clonamos para edición
    }
  }

  // -------------------------
  // Guardar cambios
  // -------------------------
  saveChanges(form: NgForm) {
    if (!this.task.title || !this.task.description) {
      return; // validación mínima
    }

    // SIMULACIÓN: actualizar en localStorage
    const saved = localStorage.getItem('taskflow_tasks_v1');
    if (saved) {
      const tasks: Task[] = JSON.parse(saved);
      const idx = tasks.findIndex(t => t.id === this.taskId);
      if (idx > -1) {
        tasks[idx] = {
          ...tasks[idx],
          ...this.task,
          createdAt: new Date(this.task.createdAt!).toISOString(),
          closedAt: this.task.closedAt ? new Date(this.task.closedAt).toISOString() : ''
        };
        localStorage.setItem('taskflow_tasks_v1', JSON.stringify(tasks));
        console.log('✅ Task actualizada (simulada):', tasks[idx]);
      }
    }
    
    // 👉 Aquí deberías conectar con backend real:
    // this.tasksService.updateTask(this.task).subscribe(...)

    this.router.navigate(['/dashboard/taskflow']); // volver al tablero
  }

  cancel() {
    this.router.navigate(['/dashboard/taskflow']);
  }
}
