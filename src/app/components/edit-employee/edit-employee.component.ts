import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';
import { EMPLOYEE_STATUS_DISABLED } from 'src/app/helpers/constants/employee';


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  @ViewChild('employeeForm') employeeForm!: NgForm;

  private newEmployee!: Employee
  public employeeFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public employeeData: Employee,
    public dialogEmployeeRef: MatDialogRef<EditEmployeeComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly employeeFormBuilder: FormBuilder,
    private readonly employeeSrv: EmployeesService
  ){}

  ngOnInit(): void {
    const { firstName, lastName } = this.employeeData

    this.employeeFormGr = this.employeeFormBuilder.group({
      firstName: new FormControl(firstName, [
        Validators.required, 
        Validators.minLength(3)]),
      lastName: new FormControl(lastName, [
        Validators.required,
        Validators.minLength(3)
      ])
    })
  }

  employeeFormSubmit() {
    this.newEmployee = this.employeeFormGr.value
    if (this.employeeData.id) {
      this.newEmployee.id = this.employeeData.id
    }

    this.employeeSrv.upsertEmployee(this.newEmployee)
    .then(res => {
      let message = 'Employee created successfully'
      if (this.newEmployee.id) {
        message = 'Employee updated successfully'
      }

      this.presentSnackBar(message)
      this.employeeForm.reset()
      this.dialogEmployeeRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('Employee already exist')
        return  
      }

      this.presentSnackBar('Could not create emloyee')
      console.error(err)
    })
  }

  async deleteEmployee() {
    const employee = { ...this.employeeData }
    
    try {
      employee.status = EMPLOYEE_STATUS_DISABLED
      await this.employeeSrv.deleteEmployee(employee)
      this.dialogEmployeeRef.close()
      this.presentSnackBar('Employee has been deleted')
    } catch (err) {
      console.error(err)
    }
  }
 
  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
