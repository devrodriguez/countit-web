import { Injectable } from '@angular/core';
import { 
  Auth,
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  User, 
  browserSessionPersistence,
} from '@angular/fire/auth';
import { collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore'
import { HttpClient } from '@angular/common/http';

import { AuthCredentials } from '../interfaces/auth/credentials';
import { AppUser } from '../interfaces/auth/app-user';

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

  async register({ credentials, roles }: AppUser) {
    const { email, password } = credentials

    try {
      const userCred = await createUserWithEmailAndPassword(this.auth, email, password)
      const { user: { uid } } = userCred;

      return uid
    } catch (err) {
      console.log(err)
    }

    return null
  }

  deleteUser(uid: string) {
    return this.http.delete(`${apiURLDeleteUser}?uid=${uid}`)
  }

  setCustomuserClaim(uid: string, role: string) {
    this.auth.currentUser
  }

  async signIn({ email, password }: AuthCredentials) {
    return this.auth.setPersistence(browserSessionPersistence)
    .then(() => signInWithEmailAndPassword(this.auth, email, password))
    
  }

  signOut() {
    return signOut(this.auth)
  }

  isAuthenticated(): boolean {
    return this.userData != null;
  }
}
