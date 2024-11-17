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
  setDoc,
  query,
  where,
  getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Employee } from '../interfaces/employee';
import { AlreadyExist } from '../helpers/errors/alreadyExist';

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

  addEmployee(employee: Employee) {
    return addDoc(this.employeesRef, employee)
  }

  async upsertEmployee(employee: Employee) {
    const now = new Date().getTime()

    const docQuery = query(this.employeesRef, where('code', '==', employee.code))
    const snap = await getDocs(docQuery)

    if (!snap.empty) {
      throw new AlreadyExist('Employee with provided code already exist')
    }

    if (employee.id) {
      employee.updatedAt = now
    } else {
      employee.createdAt = now
    }

    return setDoc(doc(this.employeesRef, employee.id), {
      ...employee,
    })
  }
}
