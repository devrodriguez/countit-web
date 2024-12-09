import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
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
export class SingleReportComponent {
  dataSource = new MatTableDataSource<Count>()
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };

  @ViewChild('exporter') exporter: MatTableExporterDirective | null = null;

  displayedColumns: string[] = [
    'block',
    'stand',
    'employee',
    'product',
    'stand_amount',
    'packaging',
    'amount',
    'created_at',
    'created_by',
  ];

  public counts!: Count[]

  constructor(
    private readonly countsSrv: CountService
  ) {
    this.loadCounts()
  }

  loadCounts() {
    this.countsSrv.getCounts()
    .subscribe({
      next: counts => {
        this.dataSource = new MatTableDataSource<Count>(counts)
        this.dataSource.filterPredicate = (data: Count, filter: string): boolean => {
          const dataStr = JSON.stringify(data).toLocaleLowerCase()
          return dataStr.includes(filter)
        }
      },
      error: err => {
        console.error(err);
      }
    })
  }

  getStands(count: Count): number | undefined {
    const { employee: { productBeds } } = count
    const { product } = count.workpoint

    if (!productBeds) return 0
    
    const productBed = productBeds.find(pb => pb.productName === product.name)

    return productBed?.bedsAmount
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
