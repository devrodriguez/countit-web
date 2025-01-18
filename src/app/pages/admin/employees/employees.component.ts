import { Component, Input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { MatDialog } from '@angular/material/dialog';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { EditEmployeeComponent } from 'src/app/components/edit-employee/edit-employee.component';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';
import { EMPLOYEE_STATUS_DISABLED } from 'src/app/helpers/constants/employee';
import { MatSnackBar } from '@angular/material/snack-bar';
import { convertBase64ToBlob } from 'src/app/helpers/converter/images';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent implements OnChanges {
  dataSource = new MatTableDataSource<Employee>()
  
  @Input() data: Employee[] = []
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };

  employeesList: Employee[] | null = null
  displayedColumns: string[] = [
    'fname',
    'lname',
    'edit',
    'qr',
    'print',
    'download',
    'remove'
  ];

  constructor(
    private employeesSrv: EmployeesService,
    private matDialogCtrl: MatDialog,
    private matSnackBarCtrl: MatSnackBar,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes employee', changes)
    if (changes['data']) {
      this.dataSource.data = changes['data'].currentValue
    }
  }

  async deleteEmployee(employee: Employee) {
    try {
      employee.status = EMPLOYEE_STATUS_DISABLED
      await this.employeesSrv.deleteEmployee(employee)
      this.presentSnackBar('El empleado ha sido eliminado')
    } catch (err) {
      console.error(err)
    }
  }

  showQRModal(employee: Employee) {  
    if (!employee.id) return
    
    this.matDialogCtrl.open(QrComponent, {
      data: {
        qrData: employee.id
      }
    })
  }

  showRemove(employee: Employee) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar empleado',
          message: `¿Deseas eliminar el empleado ${employee.firstName} ${employee.lastName}?`
        }
      }
    )
    .afterClosed()
    .subscribe(async (isConfirmed: Boolean) => {
      if(isConfirmed) {
        await this.deleteEmployee(employee)
      }
    })
  }

  showCreateEmployee(employee: Employee = {} as Employee) {
    this.matDialogCtrl.open(EditEmployeeComponent, {
      data: employee
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
    link.download = "employee"
    link.click()
    link.remove()
  }

  presentSnackBar(message: string) {
    this.matSnackBarCtrl.open(message, undefined, {
      duration: 3000
    });
  }
}
