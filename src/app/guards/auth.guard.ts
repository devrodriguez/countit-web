import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';

import { getAuth, onAuthStateChanged } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private router: Router
  ) { }
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Promise<boolean> {
    return new Promise((resolve, reject) => {
      const auth = getAuth()

      onAuthStateChanged(auth, (user) => {
        if (user) {
          resolve(true)
        } else {
          this.router.navigateByUrl('login', { replaceUrl: true })
          resolve(false)
        }
      })
    })
  }

}
