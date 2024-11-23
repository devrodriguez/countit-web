import { Block } from "./block"
import { Product } from "./product"
import { Stand } from "./stand"

export interface Workpoint {
    id?: string
    code?: string
    name?: string
    block: Block
    stand: Stand
    product: Product
    status?: string
    createdAt?: number
    updatedAt?: number
}
