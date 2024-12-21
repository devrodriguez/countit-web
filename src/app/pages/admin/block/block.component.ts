import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Block } from 'src/app/interfaces/block';
import { BlockService } from 'src/app/services/block.service';
import { EditBlockComponent } from 'src/app/components/edit-block/edit-block.component';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';
import { BLOCK_STATUS_DISABLED } from 'src/app/helpers/constants/block';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent {
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };

  employeesList: Block[] | null = null
  displayedColumns: string[] = [
    'name',
    'edit',
    'remove',
  ];
  dataSource = new MatTableDataSource<Block>()

  constructor(
    private blockSrv: BlockService,
    private matDialogCtrl: MatDialog,
    private matSnackBarCtrl: MatSnackBar,
  ) {
    this.loadBlocks()
  }

  loadBlocks() {
    this.blockSrv.getBlocks()
    .subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource<Block>(data)
      },
      error: err => {
        console.error(err)
      }
    })
  }

  showRemove(block: Block) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar bloque',
          message: `¿Deseas eliminar el bloque ${block.name}?`
        }
      }
    )
    .afterClosed()
    .subscribe(async (isConfirmed: Boolean) => {
      if(isConfirmed) {
        await this.deleteBlock(block)
      }
    })
  }

  showCreateBlock(block: Block = {} as Block) {
    this.matDialogCtrl.open(EditBlockComponent, {
      data: block
    })
  }

  async deleteBlock(block: Block) {    
    try {
      await this.blockSrv.deleteBlock(block)
      this.presentSnackBar('Bloque eliminado')
    } catch (err) {
      console.error(err)
    }
  }

  presentSnackBar(message: string) {
    this.matSnackBarCtrl.open(message, undefined, {
      duration: 3000
    });
  }
}
