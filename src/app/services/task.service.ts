import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  constructor(
    private _httpClient: HttpClient
  ) { }

  getAllTasks(filters?: {
    user_id?: number;
    status?: string;
    priority?: string;
    created_by_id?: number;
    tag?: string;
    page?: number;
  }) {
    let url = environment.baseUrl + environment.tasks.getAllTasks;
    
    if (filters) {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          params.append(key, value.toString());
        }
      });
      
      if (params.toString()) {
        url += '?' + params.toString();
      }
    }
    
    return this._httpClient.get(url, { headers: this.getAuthHeaders() })
  }

  // Obtener usuarios por departamento
  getUsersByDepartment(departmentId: number) {
    const url = `${environment.baseUrl}api/users/department/${departmentId}/`;
    return this._httpClient.get(url, { headers: this.getAuthHeaders() });
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
