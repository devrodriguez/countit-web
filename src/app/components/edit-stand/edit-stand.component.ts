import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';
import { Stand } from 'src/app/interfaces/stand';
import { StandService } from 'src/app/services/stand.service';
import { STAND_STATUS_DISABLED, STAND_STATUS_ENABLED } from 'src/app/helpers/constants/stand';

@Component({
  selector: 'app-edit-stand',
  templateUrl: './edit-stand.component.html',
  styleUrls: ['./edit-stand.component.scss']
})
export class EditStandComponent implements OnInit {
  @ViewChild('standForm') standForm!: NgForm;

  private newStand: Stand = {} as Stand
  public standFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public standData: Stand,
    public dialogStandRef: MatDialogRef<EditStandComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly standFormBuilder: FormBuilder,
    private readonly standSrv: StandService
  ){}

  ngOnInit(): void {
    const { code, name } = this.standData

    this.standFormGr = this.standFormBuilder.group({
      code: new FormControl(code, [
        Validators.required, 
        Validators.minLength(5)]),
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(5)
      ])
    })
  }

  standFormSubmit() {
    const { code, name } = this.standFormGr.value
    this.newStand = { code, name, status: STAND_STATUS_ENABLED }

    if (this.standData.id) {
      this.newStand.id = this.standData.id
    }

    this.standSrv.upsertStand(this.newStand)
    .then(res => {
      let message = 'Stand created successfully'
      if (this.newStand.id) {
        message = 'Stand updated successfully'
      }

      this.presentSnackBar(message)
      this.standForm.reset()
      this.dialogStandRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('Stand with provided code already exist')
        return  
      }

      this.presentSnackBar('Could not create emloyee')
      console.error(err)
    })
  }

  async deleteStand() {
    const stand = { ...this.standData }
    
    try {
      stand.status = STAND_STATUS_DISABLED
      await this.standSrv.upsertStand(stand)
      this.presentSnackBar('Stand has been deleted')
      this.dialogStandRef.close()
    } catch (err) {
      console.error(err)
    }
  }
 
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
