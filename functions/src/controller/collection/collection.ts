import Controller from "../../interfaces/controller.interface";
import * as express from "express";
import authMiddleware from "../../middleware/auth.middleware";
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
        this.router.post(`${this.path}/collections/create`, authMiddleware, this.createCollection);
        // @ts-ignore
        this.router.post(`${this.path}/collections/:collectionId/add-image`, authMiddleware, this.addImageToCollection);
    }

    private getAllCollection = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;
        try {
            // @ts-ignore
            const collectionDAO = new CollectionDAO(user.user_id);
            const collections = await collectionDAO.getAllCollection();

            response.status(200).send(JSON.stringify({
                status: true,
                collections: collections,
            }, null, '\t'))
        } catch (error) {
            response.send({
                status: false,
                code: error.status,
                message: error.message,
            })
        }
    }

    private createCollection = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const collectionCreateDTO: CollectionCreateDTO = request.body;
        const user = request.user;

        try {
            // @ts-ignore
            const collectionDAO = new CollectionDAO(user.user_id);
            const collection = await collectionDAO.createNewCollection(collectionDAO.convertToCollectionModel(collectionCreateDTO));

            response.status(200).send(JSON.stringify({
                status: true,
                collection: collection,
            }, null, '\t'));

        } catch (error) {
            response.send({
                status: false,
                code: error.status,
                message: error.message,
            })
        }
    }

    // private deleteColection = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //
    // }

    private addImageToCollection = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const collectionId = request.params.collectionId;
        const image = request.body;
        const user = request.user;

        try {
            // @ts-ignore
            const collectionDAO = new CollectionDAO(user.user_id);
            const addImage = await collectionDAO.addImageToCollection(image.image_id, collectionId);

            response.status(200).send(JSON.stringify({
                status: true,
                message: addImage.message,
            }, null, '\t'));
        } catch (error) {
            response.send({
                status: false,
                code: error.status,
                message: error.message,
            })
        }
    }

    // private deletedImageFromCollection = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
    //
    // }

}

export default Collection;