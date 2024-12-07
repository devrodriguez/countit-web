import { Injectable } from '@angular/core';
import {
  addDoc,
  collection,
  collectionData,
  CollectionReference,
  doc,
  DocumentData,
  Firestore,
  getDocs,
  query,
  updateDoc,
  where,
  orderBy
} from '@angular/fire/firestore';
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
    const docQuery = query(
      this.blockRef,
      where('status', '==', 'enabled'),
      orderBy('name')
    )
    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Block[]>
  }

  addBlock(product: Block) {
    return addDoc(this.blockRef, product)
  }

  deleteBlock(block: Block) {
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

  async upsertBlock(block: Block) {
    const now = new Date().getTime()

    const blockFound = await this.findBlock(block)

    if (blockFound.id) {
      if (block.id !== blockFound.id) throw new AlreadyExist()
      else if (block.id === blockFound.id) return
    }

    if (block.id) {
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

    block.createdAt = now
    block.status = BLOCK_STATUS_ENABLED

    return addDoc(this.blockRef, block)
  }

  async findBlock(block: Block) {
    const docQuery = query(this.blockRef, where('name', '==', block.name))
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
