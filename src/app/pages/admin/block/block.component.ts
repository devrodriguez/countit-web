import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';

import { Block } from 'src/app/interfaces/block';
import { BlockService } from 'src/app/services/block.service';
import { EditBlockComponent } from 'src/app/components/edit-block/edit-block.component';

@Component({
  selector: 'app-block',
  templateUrl: './block.component.html',
  styleUrls: ['./block.component.scss']
})
export class BlockComponent {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;

  employeesList: Block[] | null = null
  displayedColumns: string[] = [
    'code',
    'name',
    'edit',
  ];
  dataSource = new MatTableDataSource<Block>()

  constructor(
    private blockSrv: BlockService,
    private matDialogCtrl: MatDialog
  ) {
    this.loadBlocks()
  }

  loadBlocks() {
    this.blockSrv.getBlocks()
    .subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource<Block>(data)
        this.dataSource.paginator = this.paginator
      },
      error: err => {
        console.error(err)
      }
    })
  }

  showCreateBlock(block: Block = {} as Block) {
    this.matDialogCtrl.open(EditBlockComponent, {
      data: block
    })
  }
}
