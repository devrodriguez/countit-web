export interface Count {
    amount: number
    block: Block
    employee: Employee
    product: Product
}

export interface Block {
    id: string
    name: string
}

export interface Employee {
    nick_name: string
}

export interface Product {
    id: string
    name: string
    url_image: string
}
