import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard, redirectUnauthorizedTo, redirectLoggedInTo } from '@angular/fire/auth-guard'

import { EmployeesComponent } from './pages/admin/employees/employees.component';
import { SingleReportComponent } from './pages/counts/single-report/single-report.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { SigninComponent } from './pages/auth/signin/signin.component';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['login']);
const redirectLoggedInToItems = () => redirectLoggedInTo(['admin']);

const routes: Routes = [
  {
    path: 'login',
    component: SigninComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectLoggedInToItems }
  },
  {
    path: 'report',
    component: SingleReportComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [AuthGuard],
    data: { authGuardPipe: redirectUnauthorizedToLogin }
  },
  {
    path: 'employees',
    component: EmployeesComponent,
    canActivate: [AuthGuard]
  },
  {
    path: '**', 
    pathMatch: 'full', 
    redirectTo: 'login' 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
