import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, deleteDoc, doc, DocumentData, Firestore, getDocs, orderBy, query, updateDoc, where } from '@angular/fire/firestore'
import { Auth, User } from '@angular/fire/auth'
import { AppUser } from '../interfaces/auth/app-user';
import { Observable } from 'rxjs';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { APP_USER_STATUS_ENABLED } from '../helpers/constants/app-user';
import { AuthService } from './auth.service';
import { UserNotFound } from '../helpers/errors/userNotFound';

@Injectable({
  providedIn: 'root'
})
export class AppUserService {
  private appUserRef: CollectionReference<DocumentData>;

  constructor(
    private readonly firebase: Firestore,
    private readonly authSrv: AuthService,
  ) {
    this.appUserRef = collection(this.firebase, 'appUsers')
  }

  getAppUsers() {
    const docQuery = query(
      this.appUserRef,
      where('status', '==', 'enabled'),
      orderBy('name')
    )
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<AppUser[]>
  }

  async upsertAppUser(user: AppUser) {
    const now = new Date().getTime()

    const userFound = await this.findAppUser(user)

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

    try {
      const uid = await this.authSrv.register(user)
      user.uid = uid || ''
    } catch (err) {
      console.error(err)
    }

    user.createdAt = now
    user.status = APP_USER_STATUS_ENABLED

    return addDoc(this.appUserRef, user)
  }

  async findAppUser(user: AppUser) {
    const docQuery = query(this.appUserRef, where('email', '==', user.credentials.email))
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
