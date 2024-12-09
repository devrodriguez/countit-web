import { onRequest } from "firebase-functions/v2/https";
import * as admin from 'firebase-admin'

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

export const ping = onRequest(async (req, res) => {
    res.json({ message: 'pong' })
});
