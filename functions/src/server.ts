import App from './app';
import AuthenticationController from "./controller/authenication/authenication";
import "reflect-metadata";
import ImageQuery from "./controller/image_query/image_search";
import * as functions from "firebase-functions";

const app = new App(
    [
        new AuthenticationController(),
        new ImageQuery(),
    ],
);


exports.webApi = functions.https.onRequest(app.app);
export * from './storage-trigger/storage';
