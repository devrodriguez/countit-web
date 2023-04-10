import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Count } from 'src/app/interfaces/count';
import { CountService } from 'src/app/services/count.service';

@Component({
  selector: 'app-single-report',
  templateUrl: './single-report.component.html',
  styleUrls: ['./single-report.component.scss']
})
export class SingleReportComponent implements OnInit {
  displayedColumns: string[] = ['block', 'amount', 'product', 'employee'];
  public counts: Count[] = []

  constructor(
    private readonly countsSrv: CountService
  ) {}

  ngOnInit(): void {
      this.loadCounts()
  }

  loadCounts() {
    this.countsSrv.getCounts()
    .subscribe(counts => {
      this.counts = counts
    }, err => {
      console.error(err);
    })
  }
}
