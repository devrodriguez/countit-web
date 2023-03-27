import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Count } from '../interfaces/count';

@Injectable({
  providedIn: 'root'
})
export class CountService {
  private countsColl: CollectionReference<DocumentData>;

  constructor(
    private readonly firestore: Firestore 
  ) {
    this.countsColl = collection(this.firestore, 'counts');
  }

  getCounts() {
    return collectionData(this.countsColl, {
      idField: 'id'
    }) as Observable<Count[]>;
  }
}
