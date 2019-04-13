import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import * as express from 'express';
import Controller from "../interfaces/controller.interface";
import userModel from "../../model/user/user.model";
import User from "../../model/user/user.dto";
import {plainToClass} from "class-transformer";

// const serviceAccount = require('./../../services/photohub-e7e04-firebase-adminsdk-ym1pr-0e186f00d1.json');
// admin.initializeApp({
//     credential: admin.credential.cert(serviceAccount),
//     databaseURL: "https://photohub-e7e04.firebaseio.com"
// });

admin.initializeApp(functions.config().firebase);



class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    private user = userModel;

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        // @ts-ignore
        const userData: User = plainToClass(User, request.body);
        response.send(userData);
    }

}

export default AuthenticationController;

// router.post('/login', async (request: any, response: any) => {
//     try {
//         const user = request.body;
//         const userDataQuerySnapshot = await db.collection("users").where("username", "==", user.username).where("password", "==", user.password).get();
//         const userDatas = [] as any;
//         userDataQuerySnapshot.forEach(
//             (doc) => {
//                 userDatas.push({
//                     id: doc.id,
//                     user: doc.data()
//                 })
//             }
//         );

//         response.send(JSON.stringify({
//             userDatas: userDatas,
//             token: request.user.name
//         }));


//     } catch (error) {
//         response.status(500).send(error);
//     }

// })


// router.post('/test', async (request: any, response: any) => {
//     try {
//         const data = request.body;

//         const testRef = await db.collection('test').add(data);
//         const test = await testRef.get();

//         response.send(JSON.stringify({
//             id: test.id,
//             user: data
//         }));
//     } catch (error) {
//         response.status(500).send(error);
//     }
// })

// router.get('/test', (request, response) => {
//     db.doc('test/test-one').get()
//         .then(snapshot => {
//             response.json({
//                 id: snapshot.id + "Hahaha",
//                 data: snapshot.data()
//             })
//         })
//         .catch(error => {
//             response.status(500).send(error);
//         })
// })


