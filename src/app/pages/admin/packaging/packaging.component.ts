import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
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
export class PackagingComponent implements OnChanges {
  dataSource = new MatTableDataSource<Packaging>()

  @Input() data: Packaging[] = []
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };

  employeesList: Packaging[] | null = null
  displayedColumns: string[] = [
    'name',
    'edit',
    'remove',
  ];

  constructor(
    private packagingSrv: PackagingService,
    private matDialogCtrl: MatDialog,
    private readonly matSnackBar: MatSnackBar,
  ) {}

  ngOnChanges(changes: SimpleChanges) {
    console.log('changes packaging', changes)
    if (changes['data']) {
      this.dataSource.data = changes['data'].currentValue
    }
  }

  async deletePackaging(packaging: Packaging) {
    try {
      packaging.status = PACKAGING_STATUS_DISABLED
      await this.packagingSrv.deletePackaging(packaging)
      this.presentSnackBar('El ambalaje ha sido eliminado')
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
