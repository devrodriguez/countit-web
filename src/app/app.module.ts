import { NgModule, isDevMode } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SingleReportComponent } from './pages/counts/single-report/single-report.component';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { provideFirestore, getFirestore } from '@angular/fire/firestore'
import { provideDatabase,getDatabase } from '@angular/fire/database';
import { provideStorage,getStorage } from '@angular/fire/storage';

/** Angular Material */
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatSortModule } from '@angular/material/sort';

import { MatTableExporterModule } from 'mat-table-exporter';
import { QRCodeModule } from 'angularx-qrcode';
import { EmployeesComponent } from './pages/admin/employees/employees.component';
import { QrComponent } from './components/qr/qr.component';
import { AdminComponent } from './pages/admin/admin/admin.component';
import { WorkpointComponent } from './pages/admin/workpoint/workpoint.component';
import { ProductsComponent } from './pages/admin/products/products.component';
import { EditEmployeeComponent } from './components/edit-employee/edit-employee.component';
import { SigninComponent } from './pages/auth/signin/signin.component';
import { NavToolbarComponent } from './components/nav-toolbar/nav-toolbar.component';
import { EditWorkpointComponent } from './components/edit-workpoint/edit-workpoint.component';
import { EditProductComponent } from './components/edit-product/edit-product.component';
import { BlockComponent } from './pages/admin/block/block.component';
import { PackagingComponent } from './pages/admin/packaging/packaging.component';
import { StandComponent } from './pages/admin/stand/stand.component';
import { EditBlockComponent } from './components/edit-block/edit-block.component';
import { EditStandComponent } from './components/edit-stand/edit-stand.component';
import { EditPackagingComponent } from './components/edit-packaging/edit-packaging.component';
import { ActionConfirmComponent } from './components/action-confirm/action-confirm.component';
import { UsersComponent } from './pages/admin/users/users.component';
import { EditAppUserComponent } from './components/edit-app-user/edit-app-user.component';
import { EditUserPasswordComponent } from './components/edit-user-password/edit-user-password.component';

@NgModule({
  declarations: [
    AppComponent,
    SingleReportComponent,
    EmployeesComponent,
    QrComponent,
    AdminComponent,
    WorkpointComponent,
    ProductsComponent,
    EditEmployeeComponent,
    SigninComponent,
    NavToolbarComponent,
    EditWorkpointComponent,
    EditProductComponent,
    BlockComponent,
    PackagingComponent,
    StandComponent,
    EditBlockComponent,
    EditStandComponent,
    EditPackagingComponent,
    ActionConfirmComponent,
    UsersComponent,
    EditAppUserComponent,
    EditUserPasswordComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', {
      enabled: !isDevMode(),
      // Register the ServiceWorker as soon as the application is stable
      // or after 30 seconds (whichever comes first).
      registrationStrategy: 'registerWhenStable:30000'
    }),
    BrowserAnimationsModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
    provideFirestore(() => getFirestore()),
    provideDatabase(() => getDatabase()),
    provideStorage(() => getStorage()),
    MatNativeDateModule,
    MatButtonModule,
    MatTableModule,
    MatToolbarModule,
    MatIconModule,
    MatCardModule,
    MatPaginatorModule,
    MatInputModule,
    MatDialogModule,
    MatFormFieldModule,
    MatTableExporterModule,
    MatTabsModule,
    MatSnackBarModule,
    MatSelectModule,
    MatDatepickerModule,
    MatSortModule,
    QRCodeModule
  ],
  providers: [
    
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
