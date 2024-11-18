export class AlreadyExist extends Error {
    constructor(message: string = '') {
        super(message)
    }
}