import { onRequest } from "firebase-functions/v2/https";
import * as admin from 'firebase-admin'
import { compare, genSalt, hash } from 'bcrypt';

admin.initializeApp()

export const deleteAuthUser = onRequest({ cors: true, timeoutSeconds: 540 }, async (req, res) => {
    if (req.method !== 'DELETE') {
        res.status(400).json({ message: 'method is not valid' })
        return
    }

    if (!req.query || !req.query.uid) {
        res.status(400).json({ message: 'uid is required' })
    }

    const { query: { uid } } = req

    try {
        await admin.auth().deleteUser(uid.toString())
        res.json({ message: 'user deleted' })
    } catch (err) {
        console.error(err)

        if (err && err.code == 'auth/user-not-found') {
            res.status(404).json({
                message: 'user not found',
                error_code: err.code,
                error: err.message
            })
        }

        res.status(500).json({
            message: 'something was wrong',
            error: err.message
        })
    }
})

export const registerUser = onRequest({ cors: true, timeoutSeconds: 540 }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'method is not valid' })
    }

    try {
        const { firstName, lastName, password, status } = req.body

        if (!firstName || !lastName || !password) {
            res.status(400).json({ error: "not valid body" });
        }

        const nickname = await buildNickname(firstName, lastName)
        const saltRounds = await genSalt(10)
        const hashedPassword = await hash(password, saltRounds);

        const newUserDoc = await admin.firestore()
            .collection("users")
            .add({
                firstName,
                lastName,
                status,
                credentials: {
                    nickname: nickname,
                    password: hashedPassword,
                },
                createdAt: new Date().getTime(),
            });

        res.status(201).json({
            message: "user registered succesfully",
            user: {
                uid: newUserDoc.id,
                nickname
            }
        });
    } catch (error) {
        console.error("error on user registry", error);
        res.status(500).json({ error: "error on user registry" });
    }
})

export const updatePassword = onRequest({ cors: true, timeoutSeconds: 540 }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'method is not valid' })
    }

    const { uid, password } = req.body

    if (!uid || !password) {
        res.status(400).json({ error: "not valid body" });
    }

    try {
        const saltRounds = await genSalt(10)
        const hashedPassword = await hash(password, saltRounds);
        const docRef = admin.firestore().collection('users').doc(uid)
        await docRef.update({ 'credentials.password': hashedPassword })

        res.status(200).json({ message: 'password updated' })
    } catch (err) {
        console.error("error on update password", err);
        res.status(500).json({ error: "error on update password" });
    }
})

export const loginUser = onRequest({ cors: true, timeoutSeconds: 540 }, async (req, res) => {
    if (req.method !== 'POST') {
        res.status(400).json({ message: 'method is not valid' })
    }

    try {
        const { nickname, password } = req.body;

        if (!nickname || !password) {
            res.status(400).json({ error: "user or password not provided" });
        }

        const userQuery = await admin.firestore()
            .collection("users")
            .where("credentials.nickname", "==", nickname)
            .get();

        if (userQuery.empty) {
            res.status(404)
            .json({ 
                error: "not valid user" 
            });
        }

        const [userDoc] = userQuery.docs
        const { id: uid } = userDoc

        const { 
            firstName,
            lastName,
            credentials: 
            { 
                password: currPass 
            }
        } = userDoc.data();

        const isPasswordValid = await compare(password, currPass);
        if (!isPasswordValid) {
            res.status(401).json({ error: "not valid password" });
        }

        const customToken = await admin.auth().createCustomToken(uid);
        res.status(200).json({ 
            message: 'user logged in', 
            token: customToken,
            user: {
                fullName: `${firstName} ${lastName}`
            }
        });
    } catch (error) {
        console.error("error on user login", error);
        res.status(500).json({ error: "error on user login" });
    }
})

export const generateUserToken = onRequest({ cors: true, timeoutSeconds: 540 }, async (req, res) => {
    try {
        const { uid } = req.body

        if (!uid) {
            res.status(400).json({
                message: 'uid is required'
            })
        }

        const userToken = await admin.auth().createCustomToken(uid)

        res.status(200).json({
            token: userToken
        })
    } catch (err) {
        console.error('error al generar token de usuario', err)
        res.status(500).json({ error: 'error al generar token' })
    }
})

export const validateUserToken = onRequest({ cors: true, timeoutSeconds: 540 }, async (req, res) => {
    const tokenId = req.headers.authorization?.split('Bearer ')[1]

    if (!tokenId) {
        res.status(401).json({ error: 'token id not provided' })
    }

    try {
        const decoded = await admin.auth().verifyIdToken(tokenId)
        res.status(200).json({
            uid: decoded.uid
        })
    } catch (err) {
        console.error('error validating token', err)
        res.status(403).json({ error: 'invalid token or expired ' })
    }
})

export const ping = onRequest(async (req, res) => {
    res.json({ message: 'pong' })
});

async function buildNickname(firstName: string, lastName: string): Promise<string> {
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
