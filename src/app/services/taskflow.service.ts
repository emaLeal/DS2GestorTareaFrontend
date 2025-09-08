import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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

    constructor(private _httpClient: HttpClient) { }
    createTask(data: any) {
        const url = environment.baseUrl + environment.taskFlow.createTask;
        return this._httpClient.post(url, data, {
            headers: this.getAuthHeaders()
        });
    }

    getTaskFlow() {
        console.log("TaskFlowService - getTaskFlow called");

        const url = environment.baseUrl + environment.taskFlow.listTasks;
        return this._httpClient.get(url, {
            headers: this.getAuthHeaders()
        });
    }

    updateTask(id: number, data: any): any {
        const url = `${environment.baseUrl + environment.taskFlow.updateTask}${id}/`;
        return this._httpClient.patch(url, data, {
            headers: this.getAuthHeaders()
        });
    }

    deleteTask(id: number): any {
        const url = `${environment.baseUrl + environment.taskFlow.deleteTask}${id}/`;
        return this._httpClient.delete(url, {
            headers: this.getAuthHeaders()
        });
    }

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
}
