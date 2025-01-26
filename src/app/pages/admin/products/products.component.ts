import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { Product } from 'src/app/interfaces/product';
import { ProductsService } from 'src/app/services/products.service';
import { MatDialog } from '@angular/material/dialog';
import { QrComponent } from 'src/app/components/qr/qr.component';
import { EditProductComponent } from 'src/app/components/edit-product/edit-product.component';
import { PRODUCT_STATUS_DISABLED } from 'src/app/helpers/constants/product';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnChanges {
  dataSource = new MatTableDataSource<Product>()
  @Input() data: Product[] = []
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };

  productsList: Product[] | null = null
  displayedColumns: string[] = [
    'name',
    'edit',
    'qr',
    'print',
    'remove'
  ];

  constructor(
    private productsSrv: ProductsService,
    private matDialogCtrl: MatDialog,
    private readonly matSnackBar: MatSnackBar,
  ) {}

  ngOnChanges(changes: SimpleChanges): void {
    console.log('changes product', changes)
    if(changes['data']) {
      this.dataSource.data = changes['data'].currentValue
    }
  }

  async deleteProduct(product: Product) {
    try {
      product.status = PRODUCT_STATUS_DISABLED
      await this.productsSrv.deleteProduct(product)
      this.presentSnackBar('El producto ha sido eliminado')
    } catch (err) {
      console.error(err)
    }
  }

  showCreateProduct(product: Product = {} as Product) {
    this.matDialogCtrl.open(EditProductComponent, {
      data: product
    })
  }

  showQRModal(product: Product) {
    if (!product.id) return
    
    this.matDialogCtrl.open(QrComponent, {
      data: {
        qrData: product.id
      }
    })
  }

  showRemove(product: Product) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar producto',
          message: `¿Deseas eliminar el producto ${product.name}?`
        }
      }
    )
    .afterClosed()
    .subscribe(async (isConfirmed: Boolean) => {
      if(isConfirmed) {
        await this.deleteProduct(product)
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

  presentSnackBar(message: string) {
    this.matSnackBar.open(message, undefined, {
      duration: 3000
    });
  }
}
