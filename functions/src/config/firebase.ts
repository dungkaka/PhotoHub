import * as admin from 'firebase-admin';

admin.initializeApp({
    credential: admin.credential.applicationDefault(),
    databaseURL: 'https://photohub-e7e04.firebaseio.com/'
});
const firestoreRef = admin.firestore();

export {
    admin,
    firestoreRef,
}