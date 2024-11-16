import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeesComponent } from './pages/admin/employees/employees.component';
import { SingleReportComponent } from './pages/counts/single-report/single-report.component';
import { AdminComponent } from './pages/admin/admin/admin.component';

const routes: Routes = [
  {
    path: 'report',
    component: SingleReportComponent
  },
  {
    path: 'admin',
    component: AdminComponent
  },
  {
    path: 'employees',
    component: EmployeesComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
