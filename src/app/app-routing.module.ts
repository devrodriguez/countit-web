import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SingleReportComponent } from './pages/counts/single-report/single-report.component';

const routes: Routes = [
  {
    path: 'report',
    component: SingleReportComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
