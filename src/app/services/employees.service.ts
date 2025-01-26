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

import { Employee } from '../interfaces/employee';
import { AlreadyExist } from '../helpers/errors/alreadyExist';
import { EMPLOYEE_STATUS_ENABLED } from '../helpers/constants/employee';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EmployeesService {
  private docName = environment.app.environment === 'dev' ? 'employees-dev' : 'employees'

  private employeesRef: CollectionReference<DocumentData>;

  constructor(private readonly firestore: Firestore) { 
    this.employeesRef = collection(this.firestore, this.docName)
  }

  getEmployees() {
    const docQuery = query(
      this.employeesRef, 
      where('status', '==', 'enabled'),
      orderBy('firstName')
    )

    return collectionData(docQuery, {
      idField: 'id'
    }) as Observable<Employee[]>
  }

  addEmployee(employee: Employee) {
    return addDoc(this.employeesRef, employee)
  }

  deleteEmployee(employee: Employee) {
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

  async upsertEmployee(employee: Employee) {
    const now = new Date().getTime()

    const employeeFound = await this.findEmployee(employee)
    if (employeeFound !== null) {
      if (employee.id !== employeeFound.id) throw new AlreadyExist()
    }

    if (employee.id) {
      employee.updatedAt = now

      return updateDoc(
        doc(
          this.employeesRef,
          employee.id
        ),
        {
          ...employee,
          productBeds: employee.productBeds 
        }
      )
    }

    employee.createdAt = now
    employee.status = EMPLOYEE_STATUS_ENABLED
    
    return addDoc(this.employeesRef, employee)
  }

  async findEmployee(employee: Employee) {
    const docQuery = query(
      this.employeesRef, 
      where('firstName', '==', employee.firstName),
      where('lastName', '==', employee.lastName),
    )
    const snap = await getDocs(docQuery)

    if (snap.docs.length === 0) {
      return null
    }

    const dataEmp = snap.docs[0].data() as Employee
    const idEmpt = snap.docs[0].id

    return {
      ...dataEmp,
      id: idEmpt
    }
  }
}
