import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';
import { Block } from 'src/app/interfaces/block';
import { BlockService } from 'src/app/services/block.service';

@Component({
  selector: 'app-edit-block',
  templateUrl: './edit-block.component.html',
  styleUrls: ['./edit-block.component.scss']
})
export class EditBlockComponent implements OnInit {
  @ViewChild('blockForm') blockForm!: NgForm;

  private newBlock: Block = {} as Block
  public blockFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public blockData: Block,
    public dialogBlockRef: MatDialogRef<EditBlockComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly blockFormBuilder: FormBuilder,
    private readonly blockSrv: BlockService
  ){}

  ngOnInit(): void {
    const { name } = this.blockData

    this.blockFormGr = this.blockFormBuilder.group({
      name: new FormControl(name, [
        Validators.required,
      ])
    })
  }

  employeeFormSubmit() {
    const { name } = this.blockFormGr.value
    this.newBlock = { name }

    if (this.blockData.id) {
      this.newBlock.id = this.blockData.id
    }

    this.blockSrv.upsertBlock(this.newBlock)
    .then(res => {
      let message = 'Bloque creado correctamente'
      if (this.newBlock.id) {
        message = 'Bloque actualizado correctamente'
      }

      this.presentSnackBar(message)
      this.blockForm.reset()
      this.dialogBlockRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('El bloque ya existe')
        return  
      }

      this.presentSnackBar('No se pudo crear el bloque')
      console.error(err)
    })
  }
 
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
