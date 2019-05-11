import Controller from "../../interfaces/controller.interface";
import * as express from "express";
import authMiddleware from "../../middleware/auth.middleware";
import ImageDAO from "../../model/image/image.dao";
import RequestWithUser from "../../interfaces/requestUser.interface";
import CollectionDAO from "../../model/collection/collection.dao";


class Collection implements Controller {
    public path = "";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // @ts-ignore
        this.router.get(`${this.path}/collections`, authMiddleware, this.getAllCollection);
        // @ts-ignore
        this.router.post(`${this.path}/collections`, authMiddleware, this.createCollection);
        // @ts-ignore
        this.router.delete(`${this.path}/collections`, authMiddleware, this.deleteColection);
    }

    private getAllCollection = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {

    }


    private createCollection = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {

    }

    private deleteColection = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    }


    private addImageToCollection = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    }

    private deletedImageFromCollection = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

    }

}

export default Collection;