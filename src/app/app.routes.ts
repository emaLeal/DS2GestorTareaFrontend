import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { RouterModule } from '@angular/router';


export const routes: Routes = [

{ path: '', redirectTo: 'login', pathMatch: 'full' }, // 👈 carga register de entrada
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent }, // 👈 ruta para cambiar contraseña
  { path: '**', redirectTo: 'login' },// 👈 atrapa rutas inválidas
 
];