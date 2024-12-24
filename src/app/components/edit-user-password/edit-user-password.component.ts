import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-edit-user-password',
  templateUrl: './edit-user-password.component.html',
  styleUrls: ['./edit-user-password.component.scss']
})
export class EditUserPasswordComponent implements OnInit {
  @ViewChild('passForm') passForm!: NgForm;
  public passFormGrp!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputData: any,
    public readonly dialogPassRef: MatDialogRef<EditUserPasswordComponent>,
    private readonly formBuilder: FormBuilder,
    private readonly matSnackBar: MatSnackBar,
    private readonly authSrv: AuthService
  ){}

  ngOnInit(): void {
    this.passFormGrp = this.formBuilder.group({
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ])
    })
  }

  async formSubmit() {
    const { password } = this.passFormGrp.value

    this.authSrv.changePassword(this.inputData.uid, password)
    .subscribe({
      next: (res) => {
        console.log(res)
        this.presentSnackBar('Contraseña actualizada')
        this.passForm.reset()
        this.dialogPassRef.close()
      },
      error: (err) => {
        console.error(err)
      }
    })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
