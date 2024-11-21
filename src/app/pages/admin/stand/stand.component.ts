import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Stand } from 'src/app/interfaces/stand';
import { StandService } from 'src/app/services/stand.service';
import { EditStandComponent } from 'src/app/components/edit-stand/edit-stand.component';

@Component({
  selector: 'app-stand',
  templateUrl: './stand.component.html',
  styleUrls: ['./stand.component.scss']
})
export class StandComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  employeesList: Stand[] | null = null
  displayedColumns: string[] = [
    'code',
    'name',
    'edit',
  ];
  dataSource = new MatTableDataSource<Stand>()

  constructor(
    private standSrv: StandService,
    private matDialogCtrl: MatDialog
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

  showCreateStand(stand: Stand = {} as Stand) {
    this.matDialogCtrl.open(EditStandComponent, {
      data: stand
    })
  }
}
