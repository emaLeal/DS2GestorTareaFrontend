import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Login, User } from './auth.types';
import { environment } from '../../environments/environment';
import { catchError, Observable, throwError, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(
    private _httpClient: HttpClient,
  ) { }

  login(formData: Login): Observable<any> {
    const url = environment.baseUrl + environment.authentication.login
    return this._httpClient.post(url, formData)
      .pipe(
        tap((response: any) => {
          console.log('Login successful, response:', response.user);

          localStorage.setItem('token', response.access);
          localStorage.setItem('user_data', JSON.stringify(response.user));
        }),
        catchError(this.handleError)
      );
  }
  resetPassword(email: string): Observable<any> {
    const url = environment.baseUrl + environment.authentication.resetPassword
    return this._httpClient.post(url, { email })
  }

  register(userForm: User): Observable<any> {
    const url: string = environment.baseUrl + environment.authentication.register;
    return this._httpClient
      .post(url, userForm)
      .pipe(
        catchError(this.handleError)
      );
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

  confirmResetPassword(form: any) {
    const body = form
    delete body.confirmPassword
    const url = environment.baseUrl + environment.authentication.confirmResetPassword + body.token
    console.log(url)
    return this._httpClient.post(url, body)
  }

  requestProfile() {
    const url = environment.baseUrl + environment.authentication.profile
    return this._httpClient.get(url, { headers: this.getAuthHeaders() }).pipe(
      tap((response) => {
        localStorage.setItem('user', JSON.stringify(response));
      })
    );
  }

  getProfile() {
    const user = localStorage.getItem('user')
    return JSON.parse(localStorage.getItem('user_data')!)
  }


  handleError(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = error.error.message;
    } else {
      // Server-side error
      if (error.error && typeof error.error === 'object') {
        const firstError = Object.values(error.error)[0];
        if (Array.isArray(firstError)) {
          errorMessage = firstError[0];
        } else {
          errorMessage = JSON.stringify(error.error);
        }
      }
    }
    return throwError(() => errorMessage);
  }
}
