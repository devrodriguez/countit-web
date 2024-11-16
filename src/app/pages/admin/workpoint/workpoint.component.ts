import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { QrComponent } from 'src/app/components/qr/qr.component';
import { Workpoint } from 'src/app/interfaces/workpoint';
import { WorkpointService } from 'src/app/services/workpoint.service';

@Component({
  selector: 'app-workpoint',
  templateUrl: './workpoint.component.html',
  styleUrls: ['./workpoint.component.scss']
})
export class WorkpointComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  workpointList: Workpoint[] | null = null
  displayedColumns: string[] = [
    'code',
    'name',
    'qr',
    'print'
  ];
  dataSource = new MatTableDataSource<Workpoint>()

  constructor(
    private workpointSrv: WorkpointService,
    private matDialogCtrl: MatDialog
  ) {
    this.loadWorkpoints()
  }

  loadWorkpoints() {
    this.workpointSrv.getWorkpoints()
    .subscribe({
      next: wpData => {
        this.dataSource = new MatTableDataSource<Workpoint>(wpData)
        this.dataSource.paginator = this.paginator
      },
      error: err => {
        console.error(err)
      }
    })
  }

  showQRModal(workpoint: Workpoint) {
    this.matDialogCtrl.open(QrComponent, {
      data: {
        qrData: workpoint.code
      }
    })
  }

  printQR(item: any) {
    const qrImage = item.qrcElement.nativeElement.getElementsByTagName('img')[0].currentSrc
    const qrWindow = window.open("", "_blank")
    qrWindow?.document.write("<img style=\"min-width: 200px;\" src=\""+qrImage+"\">");
    setTimeout(()=> {
      qrWindow?.print()
      qrWindow?.close()
    }, 100)
    
  }

}
