import { Injectable } from '@angular/core';
import { Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../service/auth.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard  {
  constructor(private authService: AuthService, private router: Router) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const accessiblePaths = JSON.parse(localStorage.getItem('accessiblePaths') || '[]');
    const requestedRoute = state.url;
    
    if (accessiblePaths.includes(requestedRoute)) {
      return true;
    } else {
      this.router.navigate(['/authentication/signin']);
      return false;
    }
  }
}
