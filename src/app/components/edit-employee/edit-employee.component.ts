import { Component, OnInit, ViewChild, Inject, Input } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup, FormArray } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Employee, EmployeeProductBed } from 'src/app/interfaces/employee';
import { EmployeesService } from 'src/app/services/employees.service';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';
import { EMPLOYEE_STATUS_DISABLED } from 'src/app/helpers/constants/employee';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';


@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.scss']
})
export class EditEmployeeComponent implements OnInit {
  @ViewChild('employeeForm') employeeForm!: NgForm;

  private newEmployee!: Employee
  public employeeFormGr!: FormGroup
  public products: Product[] = [] as Product[]

  public selectedProduct!: Product
  public selectedBedAmount: number = 0

  constructor(
    @Inject(MAT_DIALOG_DATA) public parentData: Employee,
    public dialogEmployeeRef: MatDialogRef<EditEmployeeComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly employeeFormBuilder: FormBuilder,
    private readonly employeeSrv: EmployeesService,
    private readonly productSrv: ProductsService,
  ) { }

  ngOnInit(): void {
    const {
      firstName,
      lastName,
      productBeds
    } = this.parentData

    this.loadProducts()

    this.employeeFormGr = this.employeeFormBuilder.group({
      firstName: new FormControl(firstName, [
        Validators.required,
        Validators.minLength(3)]),
      lastName: new FormControl(lastName, [
        Validators.required,
        Validators.minLength(3)
      ]),
      productBeds: this.employeeFormBuilder.array([]),
      product: new FormControl('', []),
      bedsAmount: new FormControl(0, [])
    })

    productBeds.forEach(({ productName, bedsAmount }) => {
      this.appendProductBeds(productName, bedsAmount)
    })
  }

  get productBedsFrm(): FormArray {
    return this.employeeFormGr.get('productBeds') as FormArray
  }

  get allowToAddProductBed(): Boolean {
    return this.employeeFormGr.get('product')?.value !== '' && this.employeeFormGr.get('bedsAmount')?.value > 0
  }

  loadProducts() {
    this.productSrv.getProducts()
      .subscribe({
        next: res => {
          this.products = res
        },
        error: err => {
          console.error(err)
        }
      })
  }

  employeeFormSubmit() {
    const { firstName, lastName, productBeds } = this.employeeFormGr.value

    this.newEmployee = {
      firstName,
      lastName,
      productBeds: this.productBedCtrlToInterface(productBeds)
    } as Employee

    if (this.parentData.id) {
      this.newEmployee.id = this.parentData.id
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

  productBedCtrlToInterface(productBeds: any): EmployeeProductBed[] {
    return productBeds.map((item: any) => ({
      productName: item.product,
      bedsAmount: item.amount
    })) as EmployeeProductBed[]
  }

  addProductBed() {
    const { product, bedsAmount, productBeds } = this.employeeForm.value
    const currentProdBed = this.productBedCtrlToInterface(productBeds)

    const existPbIdx = currentProdBed.findIndex((pb) => pb.productName === product.name)
    if (existPbIdx >= 0) {
      this.presentSnackBar('La asignación de camas ya existe')
      return
    }

    this.appendProductBeds(product.name, bedsAmount)
    this.employeeFormGr.controls['product'].reset('')
    this.employeeFormGr.controls['bedsAmount'].reset(0)
  }

  appendProductBeds(productName: string, bedsAmount: number) {
    const pbCtrl = this.employeeFormBuilder.group({
      product: new FormControl(productName),
      amount: new FormControl(bedsAmount)
    })

    this.productBedsFrm.push(pbCtrl)
  }

  deleteProductBeds(index: number) {
    this.productBedsFrm.removeAt(index)
  }

  compareProduct(x: Product, y: Product) {
    return x && y ? x.name === y.name : x === y;
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
