import { Component, OnDestroy, OnInit } from '@angular/core';

import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { Block } from 'src/app/interfaces/block';
import { Employee } from 'src/app/interfaces/employee';
import { Packaging } from 'src/app/interfaces/packaging';
import { Product } from 'src/app/interfaces/product';
import { Stand } from 'src/app/interfaces/stand';
import { Workpoint } from 'src/app/interfaces/workpoint';
import { BlockService } from 'src/app/services/block.service';
import { EmployeesService } from 'src/app/services/employees.service';
import { PackagingService } from 'src/app/services/packaging.service';
import { ProductsService } from 'src/app/services/products.service';
import { StandService } from 'src/app/services/stand.service';
import { WorkpointService } from 'src/app/services/workpoint.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent implements OnInit, OnDestroy {
  public blocks: Block[] = [] as Block[]
  public stands: Stand[] = [] as Stand[]
  public products: Product[] = [] as Product[]
  public workpoints: Workpoint[] = [] as Workpoint[]
  public employees: Employee[] = [] as Employee[]
  public packaging: Packaging[] = [] as Packaging[]
  private destroy$ = new Subject<void>()

  constructor(
    private blockSrv: BlockService,
    private standSrv: StandService,
    private productsSrv: ProductsService,
    private workpointSrv: WorkpointService,
    private employeesSrv: EmployeesService,
    private packagingSrv: PackagingService,
  ) { }

  ngOnInit() {
    this.loadBlocks()
  }

  ngOnDestroy() {
    this.destroy$.next()
    this.destroy$.complete()
  }

  tabChange(evt: any) {
    switch (evt.index) {
      case 0:
        this.loadBlocks()
        break
      case 1:
        this.loadStands()
        break
      case 2:
        this.loadProducts()
        break
      case 3:
        this.loadWorkpoints()
        break
      case 4:
        this.loadEmployees()
        break
      case 5:
        this.loadPackaging()
        break
    }
  }

  loadBlocks() {
    this.blockSrv
    .getBlocks()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: data => {
        this.blocks = data
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadStands() {
    this.standSrv
    .getStands()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: data => {
        this.stands = data
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadProducts() {
    this.productsSrv
    .getProducts()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: data => {
        this.products = data
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadWorkpoints() {
    this.workpointSrv
    .getWorkpoints()
    .pipe(takeUntil(this.destroy$))
    .subscribe({
      next: data => {
        this.workpoints = data
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadEmployees() {
    this.employeesSrv
    .getEmployees()
    .subscribe({
      next: data => {
        this.employees = data
      },
      error: err => {
        console.error(err)
      }
    })
  }

  loadPackaging() {
    this.packagingSrv
    .getPackaging()
    .subscribe({
      next: data => {
        this.packaging = data
      },
      error: err => {
        console.error(err)
      }
    })
  }
}
