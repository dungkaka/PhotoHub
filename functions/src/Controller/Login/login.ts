import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import * as bodyParser from "body-parser";
import * as cors from 'cors';

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const app = express();
const main = express();

main.use('/api/v1', app);
main.use(bodyParser.json());
main.use(cors({ origin: true }));

export const webApi = functions.https.onRequest(main);

app.post('/test', async (request, response) => {
    try {
        const { test_name } = request.body;
        const data = {
            test_name
        }

        const testRef = await db.collection('test').add(data);
        const test = await testRef.get();

        response.send(JSON.stringify({
            id: test.id,
            test_name: test.data()
        }));
    } catch (error) {
        response.status(500).send(error);
    }
})

app.get('/test', (request, response) => {
    db.doc('test/test-one').get()
        .then(snapshot => {
            response.json({
                id: snapshot.id+"Hahaha",
                data: snapshot.data()
            })
        })
        .catch(error => {
            response.status(500).send(error);
        })


})

app.get('/images', async (request, response) => {
    const images = await db.collection('images').get();
    response.send(JSON.stringify(images.body()));
    images.