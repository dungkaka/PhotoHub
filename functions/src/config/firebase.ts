import * as admin from 'firebase-admin';

admin.initializeApp();
const firestoreRef = admin.firestore();

export {
    admin,
    firestoreRef
}