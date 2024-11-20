import { Injectable } from '@angular/core';

import { Firestore, collectionData, collection, CollectionReference, DocumentData, addDoc, query, where, getDocs, getDoc, doc, updateDoc } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Product } from '../interfaces/product';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { PRODUCT_STATUS_ENABLED } from '../helpers/constants/product';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private productRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.productRef = collection(this.firestore, 'products')
  }

  getProducts() {
    const docQuery = query(this.productRef, where('status', '==', 'enabled'))
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Product[]>
  }

  addProduct(product: Product) {
    return addDoc(this.productRef, product)
  }

  async upsertProduct(product: Product) {
    const now = new Date().getTime()

    const currentProductByCode = await this.getProductByCode(product.code)

    if (product.id) {
      const ref = await getDoc(doc(this.productRef, product.id))
      if (ref.exists()) {
        const refData = ref.data() as Product

        if (refData && refData.code === currentProductByCode.code) {
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
      }
    } 
  
    if (currentProductByCode.id) {
      throw new AlreadyExist()
    }

    product.createdAt = now
    product.status = PRODUCT_STATUS_ENABLED
    
    return addDoc(this.productRef, product)
  }

  async getProductByCode(code: string) {
    const docQuery = query(this.productRef, where('code', '==', code))
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
