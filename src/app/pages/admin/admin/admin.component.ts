import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Block } from 'src/app/interfaces/block';
import { AuthService } from 'src/app/services/auth.service';
import { BlockService } from 'src/app/services/block.service';

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  public blocks: Block[] = [] as Block[] 

  constructor(
    private blockSrv: BlockService,
  ) {}
  tabChange(evt: any) {
    // this.loadBlocks()
  }

  loadBlocks() {
    this.blockSrv.getBlocks()
    .subscribe({
      next: data => {
        this.blocks = data
      },
      error: err => {
        console.error(err)
      }
    })
  }
}
