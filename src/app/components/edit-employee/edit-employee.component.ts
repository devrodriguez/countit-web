import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormGroupDirective, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Employee } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';


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
    @Inject(MAT_DIALOG_DATA) public dataEmployee: Employee,
    public dialogEmployeeRef: MatDialogRef<EditEmployeeComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly employeeFormBuilder: FormBuilder,
    private readonly employeeSrv: EmployeesService
  ){}

  ngOnInit(): void {
    this.employeeFormGr = this.employeeFormBuilder.group({
      code: new FormControl(this.dataEmployee.code, [
        Validators.required, 
        Validators.pattern('^[0-9]*$')]),
      name: new FormControl(this.dataEmployee.name, [
        Validators.required,
        Validators.minLength(5)
      ])
    })
  }

  employeeFormSubmit() {
    this.newEmployee = this.employeeFormGr.value
    this.newEmployee.id = this.dataEmployee.id

    this.employeeSrv.upsertEmployee(this.newEmployee)
    .then(res => {
      this.presentSnackBar('Worker created successfully')
      this.employeeForm.reset()
      this.dialogEmployeeRef.close()
    })
    .catch(err => {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar(err.message)
        return  
      }
      
      this.presentSnackBar('Could not create worker')
      console.error(err)
    })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }

}
