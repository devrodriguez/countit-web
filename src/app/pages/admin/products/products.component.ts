import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { EditProductComponent } from 'src/app/components/edit-product/edit-product.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  productsList: Product[] | null = null
  displayedColumns: string[] = [
    'code',
    'name',
    'edit',
    'qr',
    'print'
  ];
  dataSource = new MatTableDataSource<Product>()

  constructor(
    private productsSrv: ProductsService,
    private matDialogCtrl: MatDialog
  ) {
    this.loadProducts()
  }

  loadProducts() {
    this.productsSrv.getProducts()
    .subscribe({
      next: productData => {
        this.dataSource = new MatTableDataSource<Product>(productData)
        this.dataSource.paginator = this.paginator
      },
      error: err => {
        console.error(err)
      }
    })
  }

  showCreateProduct(product: Product = {} as Product) {
    this.matDialogCtrl.open(EditProductComponent, {
      data: product
    })
  }

  showQRModal(employee: Product) {
    if (!employee.code) return
    
    this.matDialogCtrl.open(QrComponent, {
      data: {
        qrData: employee.id
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
