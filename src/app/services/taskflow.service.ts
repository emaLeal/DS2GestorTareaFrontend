import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../environments/environment';

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
    private getAuthHeaders(): HttpHeaders {
        const tokenString = localStorage.getItem('token');
        let token;
        try {
            token = JSON.parse(tokenString!);
        } catch (e) {
            // Si no se puede parsear como JSON, usar el token directamente
            token = { access: tokenString };
        }

        return new HttpHeaders({
            'authorization': `Bearer ${token.access}`,
            'Content-Type': 'application/json'
        });
    }
    constructor(private http: HttpClient) { }

    createTask(data: any) {
        const userData = JSON.parse(localStorage.getItem('user') || '{}');
        data.user = userData.id;
        console.log("TaskFlowService - createTask called with data:", data);
        
        const url = environment.baseUrl + environment.taskFlow.createTask;
        return this.http.post(url, data, {
            headers: this.getAuthHeaders()
        });
    }

    getTaskFlow() {
        const url = environment.baseUrl + environment.taskFlow.listTasks;
        return this.http.get(url, {
            headers: this.getAuthHeaders()
        });
    }

    getTaskFlowAll() {
        const url = environment.baseUrl + environment.taskFlow.listTasksAll;
        return this.http.get(url, {
            headers: this.getAuthHeaders()
        });
    }


    updateTask(id: number, data: any): any {
        const url = `${environment.baseUrl + environment.taskFlow.updateTask}${id}/`;
        return this.http.patch(url, data, {
            headers: this.getAuthHeaders()
        });
    }

    deleteTask(id: number): any {
        const url = `${environment.baseUrl + environment.taskFlow.deleteTask}${id}/`;
        return this.http.delete(url, {
            headers: this.getAuthHeaders()
        });
    }

}
