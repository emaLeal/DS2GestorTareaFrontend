import { inject } from '@angular/core';
import { CanActivateChild, CanActivateChildFn, CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const authGuard: CanActivateFn = (route, state) => {
  const _authService = inject(AuthService);
  const user = _authService.getProfile();

  if (!user) {
    console.log('No autenticado, bloqueando acceso');
    return inject(Router).createUrlTree(['/login']);
  }

  console.log('Guard autenticado funcionando');
  return true;
};

export const isSuperGuard: CanActivateChildFn = (route, state) => {
  const _authService = inject(AuthService);
  const user = _authService.getProfile();

  if (user?.role_id !== 1) {  // asumo 1 = superuser
    console.log('Acceso denegado para rol:', user?.role_description);
    return inject(Router).createUrlTree(['/dashboard/taskflow']);
  }

  console.log('Guard SuperUser funcionando');
  return true;
} 
