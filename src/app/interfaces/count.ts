import { Employee } from "./employee"
import { Packaging } from "./packaging"
import { Workpoint } from "./workpoint"

export interface Count {
    id: string
    amount: number
    employee: Employee
    workpoint: Workpoint
    packaging: Packaging
    createdBy: string
    createdAt: number
    updatedAt: number
}
