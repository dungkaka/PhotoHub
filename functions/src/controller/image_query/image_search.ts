import Controller from "../../interfaces/controller.interface";
import * as express from 'express';
import ImageDAO from "../../model/image/image.dao";
import HttpException from "../../exception/HttpException";
import authMiddleware from "../../middleware/auth.middleware";

class ImageQuery implements Controller {
    public path = "";
    public router = express.Router();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // @ts-ignore
        this.router.post(`${this.path}/images`, authMiddleware, this.imageQuery);
    }

    private imageQuery = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageDTO: ImageSearchDTO = request.body;

        try {
            if(imageDTO.tags) {
                const imageList = await ImageDAO.findImageByTag(imageDTO.tags);
                response.send(JSON.stringify(imageList, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }

        } catch (error) {
            response.send({
                status: false,
                code: error.status,
                message: error.message,
            })
        }
    }

}

export default ImageQuery;