import App from './app';
import AuthenticationController from "./controller/authenication/authenication";
import * as functions from 'firebase-functions';
import "reflect-metadata";
import ImageQuery from "./controller/image_query/image_search";

const app = new App(
    [
        new AuthenticationController(),
        new ImageQuery(),
    ],
);

export const webApi = functions.https.onRequest(app.app);