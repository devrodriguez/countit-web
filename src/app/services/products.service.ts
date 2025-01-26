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

import { Product } from '../interfaces/product';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { PRODUCT_STATUS_ENABLED } from '../helpers/constants/product';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private docName = environment.app.environment === 'dev' ? 'products-dev' : 'products'

  private productRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.productRef = collection(this.firestore, this.docName)
  }

  getProducts() {
    const docQuery = query(
      this.productRef, 
      where('status', '==', 'enabled'), 
      orderBy('name')
    )
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Product[]>
  }

  addProduct(product: Product) {
    return addDoc(this.productRef, product)
  }
  
  deleteProduct(product: Product) {
    return updateDoc(
      doc(
        this.productRef,
        product.id
      ),
      {
        ...product
      }
    )
  }

  async upsertProduct(product: Product) {
    const now = new Date().getTime()

    const productFound = await this.findProduct(product)
    if (productFound.id) {
      if (product.id !== productFound.id) throw new AlreadyExist()
      else if (product.id === productFound.id) return
    }

    if (product.id) {
      product.updatedAt = now

      return updateDoc(
        doc(
          this.productRef,
          product.id
        ),
        {
          ...product
        }
      )
    }

    product.createdAt = now
    product.status = PRODUCT_STATUS_ENABLED

    return addDoc(this.productRef, product)
  }

  async findProduct(product: Product) {
    const docQuery = query(this.productRef, where('name', '==', product.name))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return {} as Product
    }

    const snapData = snap.docs[0].data() as Product
    const id = snap.docs[0].id

    return {
      ...snapData,
      id
    }
  }
}
