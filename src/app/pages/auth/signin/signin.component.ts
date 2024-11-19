import { Component, OnInit, ViewChild } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthCredentials } from 'src/app/interfaces/auth/credentials';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.scss']
})
export class SigninComponent implements OnInit {
  @ViewChild('employeeForm') employeeForm!: NgForm;

  private authCredential!: AuthCredentials
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
