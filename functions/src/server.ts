import App from './app';
import AuthenticationController from "./controller/authenication/authenication";
import * as functions from 'firebase-functions';
import "reflect-metadata";

const app = new App(
    [
        new AuthenticationController(),
    ],
);

export const webApi = functions.https.onRequest(app.app);