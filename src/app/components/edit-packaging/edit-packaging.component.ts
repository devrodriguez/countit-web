import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Packaging } from 'src/app/interfaces/packaging';
import { PackagingService } from 'src/app/services/packaging.service';
import { PACKAGING_STATUS_DISABLED, PACKAGING_STATUS_ENABLED } from 'src/app/helpers/constants/packaging';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';

@Component({
  selector: 'app-edit-packaging',
  templateUrl: './edit-packaging.component.html',
  styleUrls: ['./edit-packaging.component.scss']
})
export class EditPackagingComponent {
  @ViewChild('packagingForm') packagingForm!: NgForm;

  private newPackaging: Packaging = {} as Packaging
  public packagingFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public packagingData: Packaging,
    public dialogPackagingRef: MatDialogRef<EditPackagingComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly packagingFormBuilder: FormBuilder,
    private readonly packagingSrv: PackagingService
  ){}

  ngOnInit(): void {
    const { name } = this.packagingData

    this.packagingFormGr = this.packagingFormBuilder.group({
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(3)
      ])
    })
  }

  packagingFormSubmit() {
    const { name } = this.packagingFormGr.value
    this.newPackaging = { name, status: PACKAGING_STATUS_ENABLED }

    if (this.packagingData.id) {
      this.newPackaging.id = this.packagingData.id
    }

    this.packagingSrv.upsertPackaging(this.newPackaging)
    .then(res => {
      let message = 'Embalaje creado correctamente'
      if (this.newPackaging.id) {
        message = 'Embalaje actualizado correctamente'
      }

      this.presentSnackBar(message)
      this.packagingForm.reset()
      this.dialogPackagingRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('El embalaje ya existe')
        return  
      }

      this.presentSnackBar('No se creo el embalaje')
      console.error(err)
    })
  }
 
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
