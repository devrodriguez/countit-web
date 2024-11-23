import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { MatDialog } from '@angular/material/dialog';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { EditEmployeeComponent } from 'src/app/components/edit-employee/edit-employee.component';

@Component({
  selector: 'app-employees',
  templateUrl: './employees.component.html',
  styleUrls: ['./employees.component.scss']
})
export class EmployeesComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  employeesList: Employee[] | null = null
  displayedColumns: string[] = [
    'fname',
    'lname',
    'edit',
    'qr',
    'print'
  ];
  dataSource = new MatTableDataSource<Employee>()

  constructor(
    private employeesSrv: EmployeesService,
    private matDialogCtrl: MatDialog
  ) {
    this.loadEmployees()
  }

  loadEmployees() {
    this.employeesSrv.getEmployees()
    .subscribe({
      next: employeeData => {
        this.dataSource = new MatTableDataSource<Employee>(employeeData)
        this.dataSource.paginator = this.paginator
      },
      error: err => {
        console.error(err)
      }
    })
  }

  showQRModal(employee: Employee) {    
    this.matDialogCtrl.open(QrComponent, {
      data: {
        qrData: employee.id
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
}
