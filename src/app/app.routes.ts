import { Routes } from '@angular/router';
import { LoginComponent } from './authentication/login/login.component';
import { RegisterComponent } from './authentication/register/register.component';
import { ChangePasswordComponent } from './authentication/change-password/change-password.component';
import { RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { TaskflowComponent } from './dashboard/taskflow/taskflow.component';
import { HomeBoardComponent } from './dashboard/home-board/home-board.component';
import { EditTaskComponent } from './dashboard/edit-task/edit-task.component';
import { HelpComponent } from './dashboard/help/help.component';
import { ProfileComponent } from './profile/profile.component';


export const routes: Routes = [

  { path: '', redirectTo: 'login', pathMatch: 'full' }, // carga login de entrada
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent },
  { path: 'change-password', component: ChangePasswordComponent }, // ruta para cambiar contraseña

  {
    path: 'dashboard', component: DashboardComponent, // Ruta protegida, solo accesible si el usuario está autenticado
    //luego se agrega canActivate:[Autenticated] para direccionar la ruta segun el rol del usuario 
    children: [
      { path: 'profile', component: ProfileComponent }, // ruta para el componente perfil de usuario
      { path: 'home-board', component: HomeBoardComponent }, // Ruta para el componente Dashboard
      { path: 'taskflow', component: TaskflowComponent }, // Ruta para el componente Taskflow
      { path: 'edit-task', component: EditTaskComponent }, // Ruta para el componente EditTask
      { path: 'help', component: HelpComponent }, //Ruta para el componente de ayuda 
      { path: '**', redirectTo: 'home-board' }, // ruta por defecto del dashboar

    ]
  },


  { path: '**', redirectTo: 'login' },//  atrapa rutas inválidas

];