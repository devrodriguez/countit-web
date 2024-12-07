export interface Employee {
    id: string
    firstName: string
    lastName: string
    status: string
    productBeds: EmployeeProductBed[]
    createdAt: number
    updatedAt: number
}

export interface EmployeeProductBed {
    productName: string
    bedsAmount: number
}
