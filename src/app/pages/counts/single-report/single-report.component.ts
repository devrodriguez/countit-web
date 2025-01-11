import { Component, ViewChild } from '@angular/core';
import { Count } from 'src/app/interfaces/count';
import { CountService } from 'src/app/services/count.service';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
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
  @ViewChild(MatSort) sort: MatSort
  @ViewChild('exporter') exporter: MatTableExporterDirective | null = null;

  displayedColumns: string[] = [
    'block',
    'stand',
    'employee',
    'product',
    'standAmount',
    'packaging',
    'amount',
    'createdAt',
    'createdBy',
  ];

  startDate: Date = new Date(new Date().setDate(new Date().getDate() - 7))
  endDate: Date = new Date()

  countsList: Count[] = []

  constructor(
    private readonly countsSrv: CountService
  ) {
    this.loadCounts(this.startDate, this.endDate)
  }

  async loadCounts(startDate: Date, endDate: Date) {
    const startDateStamp = new Date(startDate).setHours(0, 0, 0, 0)
    const endDateStamp = new Date(endDate).setHours(23, 59, 59, 999)

    try {
      const counts = await this.countsSrv.getCounts(startDateStamp, endDateStamp)
      this.countsList = counts.map(count => { 
        return { 
          block: count.workpoint.block.name,
          stand: count.workpoint.stand.name,
          ...count 
        } 
      })
      this.dataSource.data = this.countsList
      this.dataSource.sort = this.sort
      this.dataSource.filterPredicate = (data: Count, filter: string): boolean => {
        const dataStr = JSON.stringify(data).toLocaleLowerCase()
        return dataStr.includes(filter)
      }
    } catch (err) {
      console.error(err);
    }
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
        'fileName': 'counts-report'
      })
    }
  }

  onEndDateChange(event: any) {
    if (this.startDate && this.endDate) {
      this.loadCounts(this.startDate, this.endDate)
    }
  }
}
