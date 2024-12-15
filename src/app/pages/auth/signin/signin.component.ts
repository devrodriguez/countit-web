import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
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
    private readonly matSnackBarCtrl: MatSnackBar,
    private authSrv: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.authFormGr = this.authFormBuilder.group({
      email: new FormControl(
        'john.rodriguez.25@hotmail.com',
        [
          Validators.required,
          Validators.email
        ]
      ),
      password: new FormControl(
        'Erudito.100',
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
      await this.router.navigateByUrl('admin', { replaceUrl: true })
    } catch (err) {
      console.error(err)
      this.presentSnackBar('No pudiste iniciar sesion, intentalo de nuevo')
    }
  }

  async signOut() {
    try {
      await this.authSrv.signOut()
    } catch (err) {
      console.error(err)
    }
  }

  presentSnackBar(message: string) {
    this.matSnackBarCtrl.open(message, undefined, {
      duration: 3000
    });
  }
}
