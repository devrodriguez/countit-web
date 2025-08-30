import { Injectable } from '@angular/core';
import { 
  Firestore, 
  collection, 
  CollectionReference, 
  DocumentData, 
  query, 
  orderBy, 
  getDocs 
} from '@angular/fire/firestore';
import { Count } from '../interfaces/count';
import { where } from 'firebase/firestore';
import { environment } from 'src/environments/environment';
@Injectable({
  providedIn: 'root'
})
export class CountService {
  private collRef: CollectionReference<DocumentData>;

  private docName = environment.app.environment === 'dev' ? 'counts-dev' : 'counts'

  constructor(
    private readonly firestore: Firestore
  ) {
    this.collRef = collection(this.firestore, this.docName);
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
