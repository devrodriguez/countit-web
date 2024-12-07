import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';

import { getAuth, onAuthStateChanged } from '@firebase/auth';
import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(
    private router: Router,
    private authSrv: AuthService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      if (this.authSrv.isAuthenticated()) {
        this.router.navigateByUrl('admin', { replaceUrl: true })
        resolve(true)
      } else {
        // this.router.navigateByUrl('login', { replaceUrl: true })
        resolve(false)
      }
    })
  }
  
}
