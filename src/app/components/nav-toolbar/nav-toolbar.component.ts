import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-toolbar',
  templateUrl: './nav-toolbar.component.html',
  styleUrls: ['./nav-toolbar.component.scss']
})
export class NavToolbarComponent {
  constructor(
    private router: Router,
    private authSrv: AuthService) {}

  async signOut() {
    try {
      await this.authSrv.signOut()
      this.router.navigateByUrl('login', { replaceUrl: true })
    } catch (err) {
      console.error(err)
    }
  }
}
