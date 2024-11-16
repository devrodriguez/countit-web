import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Workpoint } from '../interfaces/workpoint';

@Injectable({
  providedIn: 'root'
})
export class WorkpointService {
  private workpointRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.workpointRef = collection(this.firestore, 'workpoint')
  }

  getWorkpoints() {
    return collectionData(this.workpointRef, {
      idField: 'id'
    }) as Observable<Workpoint[]>
  }
}
