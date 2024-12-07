import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';

import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  public authFormGr!: FormGroup

  constructor(
    private router: Router,
    private readonly authFormBuilder: FormBuilder,
    private authSrv: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.authFormGr = this.authFormBuilder.group({
      email: new FormControl(
        '',
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl(
        '',
        [
          Validators.required,
          Validators.minLength(5)
        ]
      )
    })
  }

  async signIn() {
    const { email, password } = this.authFormGr.value

    try {
      await this.authSrv.signIn({ email, password })
      this.router.navigateByUrl('admin', { replaceUrl: true })
    } catch (err) {
      console.error(err)
    }
  }

  async signOut() {
    try {
      await this.authSrv.signOut()
    } catch (err) {
      console.error(err)
    }
  }

  async createUser() {
    const { email, password } = this.authFormGr.value

    try {
      await this.authSrv.register({ email, password })
    } catch (err) {
      console.error(err)
    }
  }
}
