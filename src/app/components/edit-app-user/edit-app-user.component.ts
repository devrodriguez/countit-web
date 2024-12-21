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
    public readonly dialogBlockRef: MatDialogRef<EditAppUserComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly blockFormBuilder: FormBuilder,
    private readonly appUserSrv: AppUserService
  ){}

  get isEditingMode(): boolean {
    return this.inputData.id ? true : false
  }

  ngOnInit(): void {
    const { firstName, lastName, credentials: { nickname } = {} } = this.inputData

    this.appUserFormGr = this.blockFormBuilder.group({
      firstName: new FormControl(firstName, [
        Validators.required,
      ]),
      lastName: new FormControl(lastName, [
        Validators.required,
      ]),
      password: new FormControl(''),
    })

    if (!this.inputData.id) {
      this.appUserFormGr.get('password').setValidators(Validators.required)
    }
  }

  appUserFormSubmit() {
    const { firstName, lastName, password } = this.appUserFormGr.value
    this.newAppUser = { 
      firstName,
      lastName,
    } as AppUser

    if (this.inputData.id) {
      this.newAppUser.id = this.inputData.id
      this.newAppUser.credentials = {
        nickname : this.inputData.credentials.nickname
      }
    } else {
      this.newAppUser.credentials = {
        password
      }
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
        this.presentSnackBar('El usuario ya existe')
        return  
      }

      this.presentSnackBar('No se pudo crear el usuario, intente nuevamente')
      console.error(err)
    })
  }
 
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
