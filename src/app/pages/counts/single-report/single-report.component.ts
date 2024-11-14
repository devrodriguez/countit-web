import { Component, OnInit, ViewChild } from '@angular/core';
import { Count } from 'src/app/interfaces/count';
import { CountService } from 'src/app/services/count.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

import { MatTableExporterDirective, ExportType } from 'mat-table-exporter';

@Component({
  selector: 'app-single-report',
  templateUrl: './single-report.component.html',
  styleUrls: ['./single-report.component.scss']
})
export class SingleReportComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator | null = null;
  @ViewChild('exporter') exporter: MatTableExporterDirective | null = null;

  displayedColumns: string[] = [
    'workpoint',
    'product',
    'worker',
    'amount',
    'created_at'
  ];
  dataSource = new MatTableDataSource<Count>()

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
      this.dataSource = new MatTableDataSource<Count>(counts);
      this.dataSource.paginator = this.paginator
    }, err => {
      console.error(err);
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  exportTable(type: ExportType | 'csv' | 'xlsx') {
    if (this.exporter) {
      this.exporter.exportTable(type, {
        'fileName': 'report-counts'
      })
    }
  }
}
