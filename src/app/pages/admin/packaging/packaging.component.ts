import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Packaging } from 'src/app/interfaces/packaging';
import { PackagingService } from 'src/app/services/packaging.service';
import { EditPackagingComponent } from 'src/app/components/edit-packaging/edit-packaging.component';

@Component({
  selector: 'app-packaging',
  templateUrl: './packaging.component.html',
  styleUrls: ['./packaging.component.scss']
})
export class PackagingComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  employeesList: Packaging[] | null = null
  displayedColumns: string[] = [
    'code',
    'name',
    'edit',
  ];
  dataSource = new MatTableDataSource<Packaging>()

  constructor(
    private packagingSrv: PackagingService,
    private matDialogCtrl: MatDialog
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

  showCreatePackaging(packaging: Packaging = {} as Packaging) {
    this.matDialogCtrl.open(EditPackagingComponent, {
      data: packaging
    })
  }
}
