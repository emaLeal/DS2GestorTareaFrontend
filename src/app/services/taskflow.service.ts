import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environments';

export interface TaskFlow {
  id?: number;
  title: string;
  description?: string;
  status?: 'pending' | 'in-progress' | 'completed';
  priority?: 'low' | 'medium' | 'high';
  start_date?: string;
  due_date?: string;
  user?: number;


  created_at?: string;
  updated_at?: string;
  created_by?: number | null;
  updated_by?: number | null;
}

@Injectable({ providedIn: 'root' })

export class TaskFlowService {
  constructor(private http: HttpClient) { }

  getTaskFlow() {
    const url = environment.baseUrl + environment.taskFlow.createTask;
    return this.http.get<TaskFlow[]>(url);
  }

}
