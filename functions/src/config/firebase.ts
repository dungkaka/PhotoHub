import * as admin from 'firebase-admin';

const serviceAccount = require("D:\\Code_Project\\00_DoAn\\photohub-e7e04-firebase-adminsdk-ym1pr-57f17bd894.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://photohub-e7e04.firebaseio.com/'
});
const firestoreRef = admin.firestore();

export {
    admin,
    firestoreRef,
}