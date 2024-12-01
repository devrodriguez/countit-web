import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Stand } from 'src/app/interfaces/stand';
import { StandService } from 'src/app/services/stand.service';
import { EditStandComponent } from 'src/app/components/edit-stand/edit-stand.component';
import { STAND_STATUS_DISABLED } from 'src/app/helpers/constants/stand';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';

@Component({
  selector: 'app-stand',
  templateUrl: './stand.component.html',
  styleUrls: ['./stand.component.scss']
})
export class StandComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  employeesList: Stand[] | null = null
  displayedColumns: string[] = [
    'name',
    'edit',
    'remove'
  ];
  dataSource = new MatTableDataSource<Stand>()

  constructor(
    private standSrv: StandService,
    private matDialogCtrl: MatDialog,
    private readonly matSnackBar: MatSnackBar,
  ) {
    this.loadStands()
  }

  loadStands() {
    this.standSrv.getStands()
    .subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource<Stand>(data)
        this.dataSource.paginator = this.paginator
      },
      error: err => {
        console.error(err)
      }
    })
  }

  async deleteStand(stand: Stand) {    
    try {
      stand.status = STAND_STATUS_DISABLED
      await this.standSrv.deleteStand(stand)
      this.presentSnackBar('La mesa ha sido eliminada')
    } catch (err) {
      console.error(err)
    }
  }

  showCreateStand(stand: Stand = {} as Stand) {
    this.matDialogCtrl.open(EditStandComponent, {
      data: stand
    })
  }

  showRemove(stand: Stand) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar mesa',
          message: `¿Deseas eliminar la mesa ${stand.name}?`
        }
      }
    )
    .afterClosed()
    .subscribe(async (isConfirmed: Boolean) => {
      if(isConfirmed) {
        await this.deleteStand(stand)
      }
    })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
