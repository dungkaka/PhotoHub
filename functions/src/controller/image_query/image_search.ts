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
        this.router.post(`${this.path}/images`, authMiddleware, this.imageQueryByTag);
        // @ts-ignore
        this.router.get(`${this.path}/images`, authMiddleware, this.imageQuery);

    }

    private imageQuery = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const imageList = await ImageDAO.getAllImage();
            response.send(JSON.stringify({
                imageList,
            }, null, "\t"))
        } catch (error) {
            next(error)
        }
    }

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

}

export default ImageQuery;