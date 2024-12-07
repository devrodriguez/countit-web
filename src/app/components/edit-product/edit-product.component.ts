import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { PRODUCT_STATUS_DISABLED } from 'src/app/helpers/constants/product';
import { AlreadyExist } from 'src/app/helpers/errors/alreadyExist';
import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';

@Component({
  selector: 'app-edit-product',
  templateUrl: './edit-product.component.html',
  styleUrls: ['./edit-product.component.scss']
})
export class EditProductComponent implements OnInit {
  @ViewChild('productForm') productForm!: NgForm;

  private newProduct!: Product
  public productFormGr!: FormGroup

  constructor(
    @Inject(MAT_DIALOG_DATA) public productDataInput: Product,
    public dialogProductRef: MatDialogRef<EditProductComponent>,
    private readonly matSnackBar: MatSnackBar,
    private readonly productFormBuilder: FormBuilder,
    private readonly productSrv: ProductsService
  ) { }

  ngOnInit(): void {
    const { name } = this.productDataInput

    this.productFormGr = this.productFormBuilder.group({
      name: new FormControl(name, [
        Validators.required,
        Validators.minLength(3)
      ])
    })
  }

  async submitProductForm() {
    this.newProduct = { ...this.productFormGr.value }
    if (this.productDataInput.id) {
      this.newProduct.id = this.productDataInput.id
    }

    try {
      await this.productSrv.upsertProduct(this.newProduct)
      let message = 'Producto creado correctamente'
      if (this.newProduct.id) {
        message = 'Producto actualizado correctamente'
      }

      this.presentSnackBar(message)
      this.productForm.reset()
      this.dialogProductRef.close()
    } catch (err) {
      if (err instanceof AlreadyExist) {
        this.presentSnackBar('El producto ya existe')
        return  
      }

      this.presentSnackBar('No se pudo crear el producto')
      console.error(err)
    }
  }

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
