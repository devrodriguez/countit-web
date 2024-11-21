import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentData, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
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
    const docQuery = query(this.packagingRef, where('status', '==', 'enabled'))
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Packaging[]>
  }

  addPackaging(packaging: Packaging) {
    return addDoc(this.packagingRef, packaging)
  }

  async upsertPackaging(packaging: Packaging) {
    const now = new Date().getTime()

    const currPackagingByCode = await this.getPackagingByCode(packaging.code)

    if (packaging.id) {
      const ref = await getDoc(doc(this.packagingRef, packaging.id))
      if (ref.exists()) {
        const currPackagingByID = ref.data() as Packaging

        if (currPackagingByID && currPackagingByID.code === currPackagingByCode.code) {
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
      }
    } 
  
    if (currPackagingByCode.id) {
      throw new AlreadyExist()
    }

    packaging.createdAt = now
    
    return addDoc(this.packagingRef, packaging)
  }

  async getPackagingByCode(code: string) {
    const docQuery = query(this.packagingRef, where('code', '==', code))
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
