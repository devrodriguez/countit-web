import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { NgForm, FormBuilder, FormControl, Validators, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { Workpoint } from 'src/app/interfaces/workpoint';
import { WorkpointService } from 'src/app/services/workpoint.service';
import { BlockService } from 'src/app/services/block.service';
import { Block } from 'src/app/interfaces/block';
import { ProductsService } from 'src/app/services/products.service';
import { StandService } from 'src/app/services/stand.service';
import { Product } from 'src/app/interfaces/product';
import { Stand } from 'src/app/interfaces/stand';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';

@Component({
  selector: 'app-edit-workpoint',
  templateUrl: './edit-workpoint.component.html',
  styleUrls: ['./edit-workpoint.component.scss']
})
export class EditWorkpointComponent implements OnInit {
  @ViewChild('workpointForm') workpointForm!: NgForm;

  blocks: Block[] = [] as Block[]
  products: Product[] = [] as Product[]
  stands: Stand[] = [] as Stand[]

  selectedBlock!: Block
  selectedProduct!: Product
  selectedStand!: Stand

  private newWorkpoint: Workpoint = {} as Workpoint
  public workpointFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public inputWorkpoint: Workpoint,
    public dialogWorkpointRef: MatDialogRef<EditWorkpointComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly workpointFormBuilder: FormBuilder,
    private readonly workpointSrv: WorkpointService,
    private readonly blocksSrv: BlockService,
    private readonly productSrv: ProductsService,
    private readonly stantsSrv: StandService
  ) {

  }

  ngOnInit(): void {
    const { block, product, stand } = this.inputWorkpoint

    this.selectedBlock = block
    this.selectedProduct = product
    this.selectedStand = stand

    this.loadBlocks()
    this.loadProducts()
    this.loadStands()

    this.workpointFormGr = this.workpointFormBuilder.group({
      block: new FormControl('', [
        Validators.required,
      ]),
      product: new FormControl('', [
        Validators.required,
      ]),
      stand: new FormControl('', [
        Validators.required,
      ]),
    })
  }

  loadBlocks() {
    this.blocksSrv.getBlocks()
      .subscribe({
        next: res => {
          this.blocks = res
        },
        error: err => {
          console.error(err)
        }
      })
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

  loadStands() {
    this.stantsSrv.getStands()
      .subscribe({
        next: res => {
          this.stands = res
        },
        error: err => {
          console.error(err)
        }
      })
  }

  submitWorkpointForm() {
    const { block, product, stand } = this.workpointForm.value
    this.newWorkpoint = { block, product, stand }

    if (this.inputWorkpoint.id) {
      this.newWorkpoint.id = this.inputWorkpoint.id
    }

    this.workpointSrv.upsertWorkpoint(this.newWorkpoint)
      .then(res => {
        let message = 'Workpoint created successfully'
        if (this.newWorkpoint.id) {
          message = 'Workpoint updated successfully'
        }

        this.presentSnackBar(message)
        this.workpointForm.reset()
        this.dialogWorkpointRef.close()
      })
      .catch(err => {
        if (err instanceof AlreadyExist) {
          this.presentSnackBar('Workpoint already exist')
          return  
        }

        console.error(err)
      })
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }

  compareBlock(x: Block, y: Block) {
    return x && y ? x.name === y.name : x === y;
  }

  compareProduct(x: Product, y: Product) {
    return x && y ? x.name === y.name : x === y;
  }

  compareStand(x: Stand, y: Stand) {
    return x && y ? x.name === y.name : x === y;
  }
}
