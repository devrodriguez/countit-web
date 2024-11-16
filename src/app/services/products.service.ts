import { Injectable } from '@angular/core';

import { Firestore, collectionData, collection, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Product } from '../interfaces/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private workpointRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.workpointRef = collection(this.firestore, 'products')
  }

  getProducts() {
    return collectionData(this.workpointRef, {
      idField: 'id'
    }) as Observable<Product[]>
  }
}
