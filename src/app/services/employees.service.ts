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
  getDocs
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

import { Employee } from '../interfaces/employee';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { getDoc } from 'firebase/firestore';
import { EMPLOYEE_STATUS_ENABLED } from '../helpers/constants/employee';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private employeesRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) { 
    this.employeesRef = collection(this.firestore, 'employees')
  }

  getEmployees() {
    const docQuery = query(this.employeesRef, where('status', '==', 'enabled'))

    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Employee[]>
  }

  addEmployee(employee: Employee) {
    return addDoc(this.employeesRef, employee)
  }

  async upsertEmployee(employee: Employee) {
    const now = new Date().getTime()

    const currEmpByCode = await this.getEmployeeByCode(employee.code)

    if (employee.id) {
      const ref = await getDoc(doc(this.employeesRef, employee.id))
      if (ref.exists()) {
        const currEmpById = ref.data() as Employee

        if (currEmpById && currEmpById.code === currEmpByCode.code) {
          employee.updatedAt = now

          return updateDoc(
            doc(
              this.employeesRef,
              employee.id
            ),
            {
              ...employee
            }
          )
        }
      }
    } 
  
    if (currEmpByCode.id) {
      throw new AlreadyExist()
    }

    employee.createdAt = now
    employee.status = EMPLOYEE_STATUS_ENABLED
    
    return addDoc(this.employeesRef, employee)
  }

  async getEmployeeByCode(code: string) {
    const docQuery = query(this.employeesRef, where('code', '==', code))
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return {} as Employee
    }

    const dataEmp = snap.docs[0].data() as Employee
    const idEmpt = snap.docs[0].id

    return {
      ...dataEmp,
      id: idEmpt
    }
  }
}
