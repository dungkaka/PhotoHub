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
        this.router.get(`${this.path}/images/pagination`, this.getPaginationImage);
        // @ts-ignore
        this.router.post(`${this.path}/images/search/pagination`, this.getPaginationImageByTag);
        // @ts-ignore
        this.router.post(`${this.path}/images/:image_id/like`, authMiddleware, this.likeImage);
        // @ts-ignore
        this.router.delete(`${this.path}/images/:image_id/like`, authMiddleware, this.unLikeImage)
    }


    private getPaginationImage = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const image_id = request.query.after;
            const images = await ImageDAO.getPaginationImage(image_id);
            response.send(JSON.stringify({
                images,
            }, null, "\t"))
        } catch (error) {
            next(error)
        }
    };

    private getPaginationImageByTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageSearchDTO: ImageSearchDTO = request.body;
        const image_id = request.query.after;

        try {
            if (imageSearchDTO.tags) {
                const images = await ImageDAO.getPaginationImageByTag(imageSearchDTO.tags, image_id);
                response.send(JSON.stringify(images, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }

        } catch (error) {
            next(error)
        }
    };

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
            const images = await ImageDAO.getAllImage();
            response.send(JSON.stringify({
                images,
            }, null, "\t"))
        } catch (error) {
            next(error)
        }
    };


    private imageQueryByTag = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const imageSearchDTO: ImageSearchDTO = request.body;

        try {
            if (imageSearchDTO.tags) {
                const images = await ImageDAO.getImageByTag(imageSearchDTO.tags);
                response.send(JSON.stringify(images, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }

        } catch (error) {
            next(error)
        }
    };

    private likeImage = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;
        const image_id = request.params.image_id;

        try {
            if (image_id) {
                // @ts-ignore
                const updateImage = await ImageDAO.likeImage(user.user_id, image_id);
                response.send(JSON.stringify( {
                    status: true,
                    message: updateImage.message,
                }, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }
        } catch (error) {
            next(error);
        }

    };


    private unLikeImage = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;
        const image_id = request.params.image_id;

        try {
            if (image_id) {
                // @ts-ignore
                const updateImage = await ImageDAO.unLikeImage(user.user_id, image_id);
                response.send(JSON.stringify({
                    status: true,
                    message: updateImage.message,
                }, null, "\t"));
            } else {
                throw new HttpException(400, "Invalid message");
            }
        } catch (error) {
            next(error);
        }

    }

}

export default ImageQuery;