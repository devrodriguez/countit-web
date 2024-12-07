import { Injectable } from '@angular/core';
import {
  Firestore,
  collectionData,
  collection,
  CollectionReference,
  DocumentData,
  updateDoc,
  addDoc,
  doc,
  query,
  where,
  getDocs,
  orderBy
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Packaging } from '../interfaces/packaging';
import { AlreadyExist } from '../helpers/errors/alreadyExist';

@Injectable({
  providedIn: 'root'
})
export class PackagingService {
  private packagingRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.packagingRef = collection(this.firestore, 'packaging')
  }

  getPackaging() {
    const docQuery = query(
      this.packagingRef, 
      where('status', '==', 'enabled'), 
      orderBy('name')
    )
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Packaging[]>
  }

  addPackaging(packaging: Packaging) {
    return addDoc(this.packagingRef, packaging)
  }

  deletePackaging(packaging: Packaging) {
    return updateDoc(
      doc(
        this.packagingRef,
        packaging.id
      ),
      {
        ...packaging
      }
    )
  }

  async upsertPackaging(packaging: Packaging) {
    const now = new Date().getTime()

    const packagingFound = await this.findPackaging(packaging)

    if (packagingFound.id) {
      if (packaging.id !== packagingFound.id) throw new AlreadyExist()
      else if (packaging.id === packagingFound.id) return
    }

    if (packaging.id) {
      packaging.updatedAt = now

      return updateDoc(
        doc(
          this.packagingRef,
          packaging.id
        ),
        {
          ...packaging
        }
      )
    }

    packaging.createdAt = now

    return addDoc(this.packagingRef, packaging)
  }

  async findPackaging(packaging: Packaging) {
    const docQuery = query(this.packagingRef, where('name', '==', packaging.name))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return {} as Packaging
    }

    const docData = snap.docs[0].data() as Packaging
    const docID = snap.docs[0].id

    return {
      ...docData,
      id: docID
    }
  }
}
