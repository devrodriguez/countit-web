export class UserUnauthorized extends Error {
    constructor(message: string = '') {
        super(message)
    }
}