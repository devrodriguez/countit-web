import { Injectable } from '@angular/core';
import { addDoc, collection, collectionData, CollectionReference, doc, DocumentData, Firestore, getDoc, getDocs, query, updateDoc, where } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Block } from '../interfaces/block';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { BLOCK_STATUS_ENABLED } from '../helpers/constants/block';

@Injectable({
  providedIn: 'root'
})
export class BlockService {
  private blockRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) {
    this.blockRef = collection(this.firestore, 'blocks')
  }

  getBlocks() {
    const docQuery = query(this.blockRef, where('status', '==', 'enabled'))
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Block[]>
  }

  addBlock(product: Block) {
    return addDoc(this.blockRef, product)
  }

  async upsertBlock(block: Block) {
    const now = new Date().getTime()

    const currEmpByCode = await this.getBlockByCode(block.code)

    if (block.id) {
      const ref = await getDoc(doc(this.blockRef, block.id))
      if (ref.exists()) {
        const currEmpById = ref.data() as Block

        if (currEmpById && currEmpById.code === currEmpByCode.code) {
          block.updatedAt = now

          return updateDoc(
            doc(
              this.blockRef,
              block.id
            ),
            {
              ...block
            }
          )
        }
      }
    } 
  
    if (currEmpByCode.id) {
      throw new AlreadyExist()
    }

    block.createdAt = now
    block.status = BLOCK_STATUS_ENABLED
    
    return addDoc(this.blockRef, block)
  }

  async getBlockByCode(code: string) {
    const docQuery = query(this.blockRef, where('code', '==', code))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return {} as Block
    }

    const docData = snap.docs[0].data() as Block
    const docID = snap.docs[0].id

    return {
      ...docData,
      id: docID
    }
  }
}
