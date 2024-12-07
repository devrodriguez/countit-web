import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, DocumentData, query, orderBy } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Count } from '../interfaces/count';

@Injectable({
  providedIn: 'root'
})
export class CountService {
  private collRef: CollectionReference<DocumentData>;

  constructor(
    private readonly firestore: Firestore
  ) {
    this.collRef = collection(this.firestore, 'counts');
  }

  getCounts() {
    const docQuery = query(
      this.collRef, 
      orderBy('createdAt')
    )
    return collectionData(
      docQuery, 
      {
        idField: 'id'
      }
    ) as Observable<Count[]>;
  }
}
