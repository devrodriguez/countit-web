import { Component, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { AppUser } from 'src/app/interfaces/auth/app-user';
import { AppUserService } from 'src/app/services/app-user.service';
import { EditAppUserComponent } from 'src/app/components/edit-app-user/edit-app-user.component';
import { ActionConfirmComponent } from 'src/app/components/action-confirm/action-confirm.component';
import { AuthService } from 'src/app/services/auth.service';
import { FB_AUTH_USER_NOT_FOUND } from 'src/app/helpers/constants/app-user';
import { EditUserPasswordComponent } from 'src/app/components/edit-user-password/edit-user-password.component';

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.scss']
})
export class UsersComponent {
  @ViewChild(MatPaginator) set matPaginator(paginator: MatPaginator) {
    this.dataSource.paginator = paginator
  };

  displayedColumns: string[] = [
    'firstName',
    'lastName',
    'nickname',
    'password',
    'edit',
    'remove'
  ];
  dataSource = new MatTableDataSource<AppUser>()

  constructor(
    private appUserSrv: AppUserService,
    private matDialogCtrl: MatDialog,
    private matSnackBarCtrl: MatSnackBar,
    private authSrv: AuthService
  ) {
    this.loadAppUsers()
  }

  loadAppUsers() {
    this.appUserSrv.getAppUsers()
    .subscribe({
      next: data => {
        this.dataSource = new MatTableDataSource<AppUser>(data)
      },
      error: err => {
        console.error(err)
      }
    })
  }

  async deleteAppUser(user: AppUser) {
    try {
      await this.appUserSrv.deleteAppUser(user)
      this.presentSnackBar('Usuario eliminado')
    } catch (err) {
      console.error(err)
      this.presentSnackBar('Error al eliminar usuario')
    }
  }

  showCreateAppUser(appUser: AppUser = {} as AppUser) {
    this.matDialogCtrl.open(EditAppUserComponent, {
      data: appUser
    })
  }

  showChangePassword(appUser: AppUser) {
    this.matDialogCtrl.open(EditUserPasswordComponent, {
      data: {
        uid: appUser.id
      }
    })
  }

  showRemove(user: AppUser) {
    this.matDialogCtrl.open(
      ActionConfirmComponent,
      {
        data: {
          actionName: 'Eliminar usuario',
          message: `¿Deseas eliminar el usuario ${user.firstName} ${user.lastName}?`
        }
      }
    )
      .afterClosed()
      .subscribe(async (isConfirmed: Boolean) => {
        if (isConfirmed) {
          await this.deleteAppUser(user)
        }
      })
  }

  presentSnackBar(message: string) {
    this.matSnackBarCtrl.open(message, undefined, {
      duration: 3000
    });
  }
}
