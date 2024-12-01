import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Packaging } from 'src/app/interfaces/packaging';
import { PackagingService } from 'src/app/services/packaging.service';
import { EditPackagingComponent } from 'src/app/components/edit-packaging/edit-packaging.component';
import { PACKAGING_STATUS_DISABLED } from 'src/app/helpers/constants/packaging';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';

@Component({
  selector: 'app-packaging',
  templateUrl: './packaging.component.html',
  styleUrls: ['./packaging.component.scss']
})
export class PackagingComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  employeesList: Packaging[] | null = null
  displayedColumns: string[] = [
    'name',
    'edit',
    'remove',
  ];
  dataSource = new MatTableDataSource<Packaging>()

  constructor(
    private packagingSrv: PackagingService,
    private matDialogCtrl: MatDialog,
    private readonly matSnackBar: MatSnackBar,
  ) {
    this.loadPackaging()
  }

  loadPackaging() {
    this.packagingSrv.getPackaging()
    .subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource<Packaging>(data)
        this.dataSource.paginator = this.paginator
      },
      error: err => {
        console.error(err)
      }
    })
  }

  async deletePackaging(packaging: Packaging) {
    try {
      packaging.status = PACKAGING_STATUS_DISABLED
      await this.packagingSrv.deletePackaging(packaging)
      this.presentSnackBar('Packaging has been deleted')
    } catch (err) {
      console.error(err)
    }
  }

  showCreatePackaging(packaging: Packaging = {} as Packaging) {
    this.matDialogCtrl.open(EditPackagingComponent, {
      data: packaging
    })
  }

  showRemove(packaging: Packaging) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar embalaje',
          message: `¿Deseas eliminar el embalaje ${packaging.name}?`
        }
      }
    )
    .afterClosed()
    .subscribe(async (isConfirmed: Boolean) => {
      if(isConfirmed) {
        await this.deletePackaging(packaging)
      }
    })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
