import { Component, ViewChild, Inject, OnInit } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AppUser } from 'src/app/interfaces/auth/app-user';
import { AppUserService } from 'src/app/services/app-user.service';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';

@Component({
  selector: 'app-edit-app-user',
  templateUrl: './edit-app-user.component.html',
  styleUrls: ['./edit-app-user.component.scss']
})
export class EditAppUserComponent implements OnInit {
  @ViewChild('appUserForm') appUserForm!: NgForm;

  private newAppUser: AppUser = {} as AppUser
  public appUserFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: AppUser,
    public dialogBlockRef: MatDialogRef<EditAppUserComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly blockFormBuilder: FormBuilder,
    private readonly appUserSrv: AppUserService
  ){}

  get isEditingMode(): boolean {
    return this.inputData.id ? true : false
  }

  ngOnInit(): void {
    const { name, credentials: { email } = {} } = this.inputData

    this.appUserFormGr = this.blockFormBuilder.group({
      name: new FormControl(name, [
        Validators.required,
      ]),
      email: new FormControl(email, [
        Validators.required,
        Validators.email
      ]),
      password: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  appUserFormSubmit() {
    const { name, email, password } = this.appUserFormGr.value
    this.newAppUser = { 
      name,
      credentials: { 
        email, 
        password
      }
    }

    if (this.newAppUser.id) {
      this.newAppUser.id = this.newAppUser.id
    }

    this.appUserSrv.upsertAppUser(this.newAppUser)
    .then(() => {
      let message = 'Usuario creado correctamente'
      if (this.newAppUser.id) {
        message = 'Usuario actualizado correctamente'
      }

      this.presentSnackBar(message)
      this.appUserForm.reset()
      this.dialogBlockRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('El bloque ya existe')
        return  
      }

      this.presentSnackBar('No se pudo crear el usuario')
      console.error(err)
    })
  }
 
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
