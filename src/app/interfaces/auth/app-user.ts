import { AuthCredentials } from "./credentials"

export interface AppUser {
    id?: string
    uid?: string
    name: string
    firstName: string
    lastName: string
    email: string
    roles?: string[]
    status?: string
    createdAt?: number
    updatedAt?: number
    credentials: AuthCredentials
}