import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';
import { Block } from 'src/app/interfaces/block';
import { BlockService } from 'src/app/services/block.service';
import { BLOCK_STATUS_DISABLED } from 'src/app/helpers/constants/block';

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
    const { code, name } = this.blockData

    this.blockFormGr = this.blockFormBuilder.group({
      code: new FormControl(code, [
        Validators.required, 
        Validators.minLength(5)]),
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(5)
      ])
    })
  }

  employeeFormSubmit() {
    const { code, name } = this.blockFormGr.value
    this.newBlock = { code, name }

    if (this.blockData.id) {
      this.newBlock.id = this.blockData.id
    }

    this.blockSrv.upsertBlock(this.newBlock)
    .then(res => {
      let message = 'Block created successfully'
      if (this.newBlock.id) {
        message = 'Block updated successfully'
      }

      this.presentSnackBar(message)
      this.blockForm.reset()
      this.dialogBlockRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('Block with provided code already exist')
        return  
      }

      this.presentSnackBar('Could not create emloyee')
      console.error(err)
    })
  }

  async deleteBlock() {
    const block = { ...this.blockData }
    
    try {
      block.status = BLOCK_STATUS_DISABLED
      await this.blockSrv.upsertBlock(block)
      this.dialogBlockRef.close()
      this.presentSnackBar('Block has been deleted')
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
