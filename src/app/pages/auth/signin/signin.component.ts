import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

import { UserUnauthorized } from 'src/app/helpers/errors/userUnauthorized';
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
    private readonly authSrv: AuthService,
  ) {

  }

  ngOnInit(): void {
    this.authFormGr = this.authFormBuilder.group({
      nickname: new FormControl(
        '',
        [
          Validators.required,
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
    const { nickname, password } = this.authFormGr.value

    try {
      await this.authSrv.signIn(nickname, password)
      await this.router.navigateByUrl('admin', { replaceUrl: true })
    } catch (err) {
      console.error(err)
      if (err instanceof UserUnauthorized) {
        this.presentSnackBar('Usuario o contraseña no validos')

        return  
      }

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
