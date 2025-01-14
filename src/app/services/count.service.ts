import { Injectable } from '@angular/core';
import { Firestore, collectionData, collection, CollectionReference, DocumentData, query, orderBy, getDocs } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Count } from '../interfaces/count';
import { where } from 'firebase/firestore';
import { SortDirection } from '@angular/material/sort';

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

  async getCounts(startDate: number, endDate: number) {
    let docQuery = query(
      this.collRef, 
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate),
      orderBy('createdAt', 'desc'),
    )

    const querySnap = await getDocs(docQuery)
    return querySnap.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    } as Count))
  }
}
