import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collectionData, 
  collection, 
  CollectionReference, 
  DocumentData, 
  addDoc, 
  doc, 
  updateDoc, 
  query, 
  where, 
  getDocs,
  orderBy 
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Workpoint } from '../interfaces/workpoint';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { WORKPOINT_STATUS_ENABLED } from '../helpers/constants/workpoint';

@Injectable({
  providedIn: 'root'
})
export class WorkpointService {
  private workpointRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.workpointRef = collection(this.firestore, 'workpoint')
  }

  getWorkpoints() {
    const docQuery = query(this.workpointRef, where('status', '==', 'enabled'))
    
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Workpoint[]>
  }

  addWorkpoint(workpoint: Workpoint) {
    return addDoc(this.workpointRef, workpoint)
  }

  deleteWorkpoint(workpoint: Workpoint) {
    return updateDoc(
      doc(
        this.workpointRef,
        workpoint.id
      ),
      {
        ...workpoint
      }
    )
  }

  async upsertWorkpoint(workpoint: Workpoint) {
    const now = new Date().getTime()

    const workpointFound = await this.findWorkpoint(workpoint)

    if (workpointFound.id) {
      if (workpoint.id !== workpointFound.id) throw new AlreadyExist()
      else if (workpoint.id === workpointFound.id) return
    }

    if (workpoint.id) {
      workpoint.updatedAt = now

      return updateDoc(
        doc(
          this.workpointRef,
          workpoint.id
        ),
        {
          ...workpoint
        }
      )
    }

    workpoint.createdAt = now
    workpoint.status = WORKPOINT_STATUS_ENABLED
    
    return addDoc(this.workpointRef, workpoint)
  }

  async findWorkpoint(workpoint: Workpoint) {
    const { block, product, stand, employee } = workpoint
    const docQuery = query(
      this.workpointRef, 
      where('block.id', '==', block.id),
      where('product.id', '==', product.id),
      where('stand.id', '==', stand.id),
      where('employee.id', '==', employee.id),
    )
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return {} as Workpoint
    }

    const docData = snap.docs[0].data() as Workpoint
    const docID = snap.docs[0].id

    return {
      ...docData,
      id: docID
    }
  }

}
