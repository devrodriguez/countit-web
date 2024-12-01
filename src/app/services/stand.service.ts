import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentData, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';

import { Observable } from 'rxjs';

import { Stand } from '../interfaces/stand';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { STAND_STATUS_ENABLED } from '../helpers/constants/stand';

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

  deleteStand(stand: Stand) {
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

  async upsertStand(stand: Stand) {
    const now = new Date().getTime()

    const standFound = await this.findStand(stand)
    if (standFound !== null) {
      throw new AlreadyExist()
    }

    if (stand.id) {
      stand.updatedAt = now

      return updateDoc(
        doc(
          this.standRef,
          stand.id
        ),
        {
          ...stand,
        }
      )
    }

    stand.createdAt = now
    stand.status = STAND_STATUS_ENABLED
    
    return addDoc(this.standRef, stand)
  }

  async findStand(stand: Stand) {
    const docQuery = query(this.standRef, where('name', '==', stand.name))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return null
    }

    const docData = snap.docs[0].data() as Stand
    const docID = snap.docs[0].id

    return {
      ...docData,
      id: docID
    }
  }
}
