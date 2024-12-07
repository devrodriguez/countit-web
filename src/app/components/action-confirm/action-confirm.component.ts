import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-action-confirm',
  templateUrl: './action-confirm.component.html',
  styleUrls: ['./action-confirm.component.scss']
})
export class ActionConfirmComponent {
  public inputMessage: string
  public inputAction: string

  constructor(
    public dialog: MatDialogRef<ActionConfirmComponent>,
    @Inject(MAT_DIALOG_DATA) public parentData: any,
  ) {
    const { message, actionName } = this.parentData
    this.inputMessage = message
    this.inputAction = actionName
  }

  confirm() {
    this.dialog.close(true)
  }

  cancel() {
    this.dialog.close(false)
  }
}
