import { Injectable } from '@angular/core';
import { 
  Auth,
  signInWithCustomToken, 
  signOut, 
  onAuthStateChanged,
  User, 
  browserSessionPersistence,
} from '@angular/fire/auth';
import { collection, CollectionReference, DocumentData, Firestore } from '@angular/fire/firestore'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { UserUnauthorized } from '../helpers/errors/userUnauthorized';
import { AppUser } from '../interfaces/auth/app-user';

const apiURLDeleteUser = 'https://deleteauthuser-xzkfsurz5q-uc.a.run.app'
const apiURLGetUserToken = 'https://generateusertoken-xzkfsurz5q-uc.a.run.app'
const apiURLValidateUserToken = 'https://validateusertoken-xzkfsurz5q-uc.a.run.app'
const apiURLLoginUser = 'https://loginuser-xzkfsurz5q-uc.a.run.app'
const apiURLRegisterUser = 'https://registeruser-xzkfsurz5q-uc.a.run.app'
const apiURLUpdatePassword = 'https://updatepassword-xzkfsurz5q-uc.a.run.app'

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

  async registerUser(user: AppUser) {
    const { firstName, lastName, status, credentials: { password }} = user

    try {
      const resObs$ = this.http.post(
        apiURLRegisterUser, { 
          firstName, 
          lastName, 
          password, 
          status 
        })
      const res = await firstValueFrom(resObs$)

      return res
    } catch (err) {
      console.error('error registering user', err)
      throw new Error('error registering user')
    }
  }

  deleteUser(uid: string) {
    return this.http.delete(`${apiURLDeleteUser}?uid=${uid}`)
  }

  setCustomuserClaim(uid: string, role: string) {
    this.auth.currentUser
  }

  async signIn(nickname: string, password: string) {
    try {
      const resObs$ = this.http.post<{ token: string }>(apiURLLoginUser, { nickname, password })
      const res = await firstValueFrom(resObs$)
      const { token } = res
      this.setToken(token)

      await this.auth.setPersistence(browserSessionPersistence)
      await signInWithCustomToken(this.auth, token)
    } catch (err) {
      console.error(err)
      if (err.status === 401) {
        throw new UserUnauthorized(err.message)
      }

      throw new Error('error authenticating user')
    }
  }

  async signInWithToken(uid: string): Promise<string> {
    try {
      const resObs$ = this.getUserToken(uid)
      const token = await firstValueFrom(resObs$)
      const userToken = token.token
      return userToken
    } catch (err) {
      console.error(err)
      throw new Error('error authenticating user')
    }
  }

  signOut() {
    return signOut(this.auth)
  }

  getUserToken(uid: string) {
    return this.http.post<{ token: string }>(apiURLGetUserToken, { uid })
  }

  isAuthenticated(): boolean {
    return this.userData != null;
  }

  getToken(): string | null {
    return localStorage.getItem('awt');
  }

  setToken(token: string): void {
    localStorage.setItem('awt', token);
  }

  async validateUserToken() {
    const token = this.getToken()

    if (!token) {
      throw new Error('user have not token')
    }

    try {
      const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`)
      const res$ = this.http.post<{ uid: string }>(apiURLValidateUserToken, { token }, { headers })
      const res = await firstValueFrom(res$)
      return res.uid
    } catch (err) {
      console.error(err)
      throw new Error('error validating user')
    }
  }

  changePassword(uid: string, password: string) {
    return this.http.post(apiURLUpdatePassword, { uid, password })
  }
}
