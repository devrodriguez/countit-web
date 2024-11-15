import { Injectable } from '@angular/core';

import { Firestore, collectionData, collection, CollectionReference, DocumentData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { Employee } from '../interfaces/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private employeesRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) { 
    this.employeesRef = collection(this.firestore, 'workers')
  }

  getEmployees() {
    return collectionData(this.employeesRef, {
      idField: 'id'
    }) as Observable<Employee[]>
  }
}
