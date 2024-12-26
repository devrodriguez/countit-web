import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithCustomToken,
  signOut,
  onAuthStateChanged,
  User,
  browserSessionPersistence,
} from '@angular/fire/auth';
import { Firestore } from '@angular/fire/firestore'
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

import { UserUnauthorized } from '../helpers/errors/userUnauthorized';
import { AppUser } from '../interfaces/auth/app-user';

const apiURLDeleteUser = 'https://deleteauthuser-xzkfsurz5q-uc.a.run.app'
const apiURLLoginUser = 'https://loginuser-xzkfsurz5q-uc.a.run.app'
const apiURLRegisterUser = 'https://registeruser-xzkfsurz5q-uc.a.run.app'
const apiURLUpdatePassword = 'https://updatepassword-xzkfsurz5q-uc.a.run.app'

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  userData!: User | null

  constructor(
    private readonly auth: Auth,
    private readonly http: HttpClient
  ) {
    onAuthStateChanged(auth, (user) => {
      this.userData = user
    })
  }

  async registerUser(user: AppUser) {
    const { firstName, lastName, status, credentials: { password } } = user

    const headers: HttpHeaders = new HttpHeaders({
      Authorization: `Bearer ${this.getIdToken()}`
    })

    try {
      const resObs$ = this.http.post(
        apiURLRegisterUser,
        {
          firstName,
          lastName,
          password,
          status
        },
        { 
          headers
        }
      )
      const res = await firstValueFrom(resObs$)
      return res
    } catch (err) {
      console.error('error registering user', err)
      throw new Error('error registering user')
    }
  }

  deleteUser(uid: string) {
    const headers = new HttpHeaders({
      Aauthorization: `Bearer ${this.getIdToken()}`
    })

    return this.http.delete(
      `${apiURLDeleteUser}?uid=${uid}`,
      { 
        headers,
      }
    )
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
      const userCred = await signInWithCustomToken(this.auth, token)
      const idToken = await userCred.user.getIdToken(true)
      this.setIdToken(idToken)
    } catch (err) {
      console.error(err)
      if (err.status === 401) {
        throw new UserUnauthorized(err.message)
      }

      throw new Error('error authenticating user')
    }
  }

  signOut() {
    return signOut(this.auth)
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

  getIdToken() {
    return localStorage.getItem('it')
  }

  setIdToken(it: string) {
    localStorage.setItem('it', it)
  }

  removeIdToken() {
    localStorage.removeItem('it')
  }

  changePassword(uid: string, password: string) {
    const headers = new HttpHeaders({
      Aauthorization: `Bearer ${this.getIdToken()}`
    })

    return this.http.post(
      apiURLUpdatePassword, 
      { 
        uid, 
        password 
      },
      {
        headers
      }
    )
  }
}
