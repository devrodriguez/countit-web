import { Injectable } from '@angular/core';
import { 
  CollectionReference,
  DocumentData,
  Firestore,
  collection, 
  collectionData, 
  deleteDoc,
  doc, 
  getDocs,  
  query, 
  updateDoc, 
  where,
  orderBy,
 } from '@angular/fire/firestore'
import { AppUser } from '../interfaces/auth/app-user';
import { Observable } from 'rxjs';

import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { APP_USER_STATUS_ENABLED } from '../helpers/constants/app-user';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private appUserRef: CollectionReference<DocumentData>;

  constructor(
    private readonly firestore: Firestore,
    private readonly authSrv: AuthService,
  ) {
    this.appUserRef = collection(this.firestore, 'users')
  }

  getAppUsers() {
    const docQuery = query(
      this.appUserRef,
      where('status', '==', 'enabled'),
      orderBy('firstName')
    )
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<AppUser[]>
  }

  async upsertAppUser(user: AppUser) {
    const { credentials: { nickname }} = user
    const now = new Date().getTime()

    const userFound = await this.findAppUser(nickname)
    if (userFound && userFound.id) {
      if (user.id !== userFound.id) throw new AlreadyExist()
      else if (user.id === userFound.id) return
    }

    if (user && user.id) {
      user.updatedAt = now

      return updateDoc(
        doc(
          this.appUserRef,
          user.id
        ),
        {
          ...user
        }
      )
    }

    user.createdAt = now
    user.status = APP_USER_STATUS_ENABLED

    return this.authSrv.registerUser(user)
  }

  async findAppUser(nickname: string) {
    if (!nickname) return null
    
    const docQuery = query(this.appUserRef, where('credentials.nickname', '==', nickname))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return null
    }

    const docData = snap.docs[0].data() as AppUser
    const docID = snap.docs[0].id

    return {
      ...docData,
      id: docID
    }
  }

  async deleteAppUser(appuser: AppUser) { 
    await deleteDoc(
      doc(
        this.appUserRef,
        appuser.id
      )
    )
    
  }
}
