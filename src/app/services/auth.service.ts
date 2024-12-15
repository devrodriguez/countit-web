import { Injectable } from '@angular/core';
import { 
  Auth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User, 
  browserSessionPersistence,
  updateProfile,
} from '@angular/fire/auth';
import { collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore'
import { HttpClient } from '@angular/common/http';

import { AuthCredentials } from '../interfaces/auth/credentials';
import { AppUser } from '../interfaces/auth/app-user';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { FB_AUTH_EMAIL_ALREADY_IN_USE } from '../helpers/constants/app-user';

const apiURLDeleteUser = 'https://deleteauthuser-xzkfsurz5q-uc.a.run.app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData!: User | null
  private appUserRef: CollectionReference<DocumentData>;

  constructor(
    private readonly auth: Auth,
    private readonly firestore: Firestore,
    private http: HttpClient
  ) {
    this.appUserRef = collection(this.firestore, 'users')
    onAuthStateChanged(auth, (user) => {
      this.userData = user
    })
  }

  async register(appUser: AppUser) {
    const { 
      name,
      credentials: { email, password } 
    } = appUser

    try {
      const userCred = await createUserWithEmailAndPassword(this.auth, email, password)
      const { user } = userCred
      const { uid } = user
      await updateProfile(user, { displayName: appUser.name })

      return uid
    } catch (err) {
      console.log(JSON.stringify(err))
      
      if (err.code === FB_AUTH_EMAIL_ALREADY_IN_USE) {
        throw new AlreadyExist()
      }

      throw err
    }
  }

  deleteUser(uid: string) {
    return this.http.delete(`${apiURLDeleteUser}?uid=${uid}`)
  }

  setCustomuserClaim(uid: string, role: string) {
    this.auth.currentUser
  }

  async signIn({ email, password }: AuthCredentials) {
    await this.auth.setPersistence(browserSessionPersistence)
    await signInWithEmailAndPassword(this.auth, email, password)
  }

  signOut() {
    return signOut(this.auth)
  }

  isAuthenticated(): boolean {
    return this.userData != null;
  }
}
