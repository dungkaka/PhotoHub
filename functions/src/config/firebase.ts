import * as admin from 'firebase-admin';

const serviceAccount = require('./photohub-e7e04-firebase-adminsdk-ym1pr-57f17bd894.json');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://photohub-e7e04.firebaseio.com/',
    storageBucket: 'photohub-e7e04.appspot.com',
});

const firestoreRef = admin.firestore();

export {
    admin,
    firestoreRef,
}