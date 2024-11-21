import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentData, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Stand } from '../interfaces/stand';
import { AlreadyExist } from '../helpers/errors/alreadyExist';

@Injectable({
  providedIn: 'root'
})
export class StandService {
  private standRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.standRef = collection(this.firestore, 'stands')
  }

  getStands() {
    const docQuery = query(this.standRef, where('status', '==', 'enabled'))
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Stand[]>
  }

  addStand(product: Stand) {
    return addDoc(this.standRef, product)
  }

  async upsertStand(stand: Stand) {
    const now = new Date().getTime()

    const currStandByCode = await this.getStandByCode(stand.code)

    if (stand.id) {
      const ref = await getDoc(doc(this.standRef, stand.id))
      if (ref.exists()) {
        const currStandByID = ref.data() as Stand

        if (currStandByID && currStandByID.code === currStandByCode.code) {
          stand.updatedAt = now

          return updateDoc(
            doc(
              this.standRef,
              stand.id
            ),
            {
              ...stand
            }
          )
        }
      }
    } 
  
    if (currStandByCode.id) {
      throw new AlreadyExist()
    }

    stand.createdAt = now
    
    return addDoc(this.standRef, stand)
  }

  async getStandByCode(code: string) {
    const docQuery = query(this.standRef, where('code', '==', code))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return {} as Stand
    }

    const docData = snap.docs[0].data() as Stand
    const docID = snap.docs[0].id

    return {
      ...docData,
      id: docID
    }
  }
}
