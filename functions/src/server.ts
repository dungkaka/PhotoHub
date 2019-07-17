import App from './app';
import AuthenticationController from "./controller/account/authenication";
import "reflect-metadata";
import ImageQuery from "./controller/image/image";
import * as functions from "firebase-functions";
import Collection from "./controller/collection/collection";
import Tag from "./controller/tag/tag";

const app = new App(
    [
        new AuthenticationController(),
        new ImageQuery(),
        new Collection(),
        new Tag(),
    ],
);


exports.webApi = functions.https.onRequest(app.app);
export * from './storage-trigger/storage';
