import Controller from "../../interfaces/controller.interface";
import * as express from 'express';
import ImageDAO from "../../model/image/image.dao";
import HttpException from "../../exception/HttpException";
import authMiddleware from "../../middleware/auth.middleware";
import RequestWithUser from "../../interfaces/requestUser.interface";

class ImageQuery implements Controller {
    public path = "";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // @ts-ignore
        this.router.post(`${this.path}/images`, authMiddleware, this.addImage);
        // @ts-ignore
        this.router.post(`${this.path}/images/search`, authMiddleware, this.imageQueryByTag);
        // @ts-ignore
        this.router.get(`${this.path}/images`, authMiddleware, this.imageQuery);
        // @ts-ignore
        this.router.get(`${this.path}/images/first`, authMiddleware, this.getImagePaginationFirst);
        // @ts-ignore
        this.router.get(`${this.path}/images/after`, authMiddleware, this.getImagePaginationAfter);
        // @ts-ignore
        this.router.post(`${this.path}/images/search/first`, authMiddleware, this.getImageByTagPaginationFirst);
        // @ts-ignore
        this.router.post(`${this.path}/images/search/after`, authMiddleware, this.getImageByTagPaginationAfter);

    }

    private addImage = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const imageDTO = request.body;
            const image = await ImageDAO.addImage(imageDTO);
            response.status(200).send(JSON.stringify({
                status: true,
                image: image,
            }, null, `\t`))

        } catch (error) {
            next(error);
        }
    };

    private imageQuery = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const imageList = await ImageDAO.getAllImage();
            response.send(JSON.stringify({
                imageList,
            }, null, "\t"))
        } catch (error) {
            next(error)
        }
    };

    private getImagePaginationFirst = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const imageList = await ImageDAO.getPaginationImageFirst();
            response.send(JSON.stringify({
                imageList,
            }, null, "\t"))
        } catch (error) {
            next(error)
        }
    };

    private getImagePaginationAfter = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const imageList = await ImageDAO.getPaginationImageAfter();
            response.send(JSON.stringify({
                imageList,
            }, null, "\t"))
        } catch (error) {
            next(error)
        }
    };

    private imageQueryByTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageSearchDTO: ImageSearchDTO = request.body;

        try {
            if (imageSearchDTO.tags) {
                const imageList = await ImageDAO.findImageByTag(imageSearchDTO.tags);
                response.send(JSON.stringify(imageList, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }

        } catch (error) {
            next(error)
        }
    }

    private getImageByTagPaginationFirst = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageSearchDTO: ImageSearchDTO = request.body;

        try {
            if (imageSearchDTO.tags) {
                const imageList = await ImageDAO.getImageByTagPaginationFirst(imageSearchDTO.tags);
                response.send(JSON.stringify(imageList, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }

        } catch (error) {
            next(error)
        }
    }

    private getImageByTagPaginationAfter = async (request: express.Request, response: express.Response, next: express.NextFunction) => {

        try {

            const imageList = await ImageDAO.getImageByTagPaginationAfter();
            response.send(JSON.stringify(imageList, null, "\t"));

        } catch (error) {
            next(error)
        }
    }


}

export default ImageQuery;