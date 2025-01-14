import { Component, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';

import { QrComponent } from 'src/app/components/qr/qr.component';
import { Workpoint } from 'src/app/interfaces/workpoint';
import { WorkpointService } from 'src/app/services/workpoint.service';
import { EditWorkpointComponent } from 'src/app/components/edit-workpoint/edit-workpoint.component';
import { WORKPOINT_STATUS_DISABLED } from 'src/app/helpers/constants/workpoint';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';
import { convertBase64ToBlob } from 'src/app/helpers/converter/images';

@Component({
  selector: 'app-workpoint',
  templateUrl: './workpoint.component.html',
  styleUrls: ['./workpoint.component.scss']
})
export class WorkpointComponent {
  dataSource = new MatTableDataSource<Workpoint>()
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };
  @ViewChild(MatSort) sort: MatSort

  workpointList: Workpoint[] = []
  displayedColumns: string[] = [
    'employee',
    'place',
    'product',
    'stand',
    'edit',
    'qr',
    'print',
    'download',
    'remove',
  ];

  constructor(
    private workpointSrv: WorkpointService,
    private matDialogCtrl: MatDialog,
    private matSnackBar: MatSnackBar,
  ) {
    this.loadWorkpoints()
  }

  async loadWorkpoints() {
    try {
      const wpData = await this.workpointSrv.getWorkpoints()
      this.workpointList = wpData.map(wp => {
        return {
          place: wp.block.name,
          ...wp,
        }
      })
      this.dataSource.data = this.workpointList
      this.dataSource.sort = this.sort
    } catch (err) {
      console.error(err)
    }
  }

  async deleteWorkpoint(workpoint: Workpoint) {
    try {
      workpoint.status = WORKPOINT_STATUS_DISABLED
      await this.workpointSrv.deleteWorkpoint(workpoint)
      this.presentSnackBar('Se ha eliminado el puesto de trabajo')
    } catch (err) {
      console.error(err)
    }
  }

  showQRModal(workpoint: Workpoint) {
    if (!workpoint.id) return

    this.matDialogCtrl.open(QrComponent, {
      data: {
        qrData: workpoint.id
      }
    })
  }

  showCreateWorkpoint(workpoint: Workpoint = {} as Workpoint) {
    this.matDialogCtrl.open(EditWorkpointComponent, {
      data: workpoint
    })
  }

  showRemove(workpoint: Workpoint) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar puesto de trabajo',
          message: `¿Deseas eliminar el puesto de trabajo?`
        }
      }
    )
      .afterClosed()
      .subscribe(async (isConfirmed: Boolean) => {
        if (isConfirmed) {
          await this.deleteWorkpoint(workpoint)
        }
      })
  }

  printQR(item: any) {
    const qrImage = item.qrcElement.nativeElement.getElementsByTagName('img')[0].currentSrc
    const qrWindow = window.open("", "_blank")
    qrWindow?.document.write("<img style=\"min-width: 200px;\" src=\"" + qrImage + "\">");
    setTimeout(() => {
      qrWindow?.print()
      qrWindow?.close()
    }, 100)
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }

  downloadQR(code: any) {
    const { qrcElement: { nativeElement } } = code
    const imgs = nativeElement.getElementsByTagName('img')
    const [fimg] = imgs
    const { src } = fimg
    const codeBlob = convertBase64ToBlob(src)

    const blob = new Blob([codeBlob], { type: "image/png" })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement("a")
    link.href = url
    // name of the file
    link.download = "workpoint"
    link.click()
    link.remove()
  }
}
