export const buildNickname = async (admin: any, firstName: string, lastName: string): Promise<string> => {
    let nickname = ''
    let exist = true
    let attempt = 0

    const firstNameSp = firstName.split(' ')[0]
    const lastNameSp = lastName.split(' ')[0]
    const normalLastName = lastNameSp.toLowerCase().replace(/\s+/g, '')

    while (exist) {
        if (attempt < firstNameSp.length) {
            const currentLetter = firstNameSp[attempt].toLowerCase()
            nickname = `${currentLetter}${normalLastName}`
        } else {
            nickname = `${normalLastName[0]}${normalLastName}`
        }

        const userFound = await admin.firestore().collection('users').where('nickname', '==', nickname).get()

        if (userFound.empty) break

        attempt++
    }

    return nickname
}