import Controller from "../../interfaces/controller.interface";
import * as express from 'express';
import authMiddleware from "../../middleware/auth.middleware";
import RequestWithUser from "../../interfaces/requestUser.interface";
import TagDAO from "../../model/tag/tag.dao";

class Tag implements Controller {
    path = "";
    router = express.Router();

    constructor() {
        // @ts-ignore
        this.router.get(`${this.path}/tags`, authMiddleware, this.getTags);

        // @ts-ignore
        this.router.post(`${this.path}/tags`, authMiddleware, this.addTag);
    }

    private addTag = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const tagsDTO = request.body;

        try {
            // @ts-ignore
            const tags = await TagDAO.addTag(tagsDTO);

            response.status(200).send(JSON.stringify({
                status: true,
                tags: tags
            }, null, '\t'));

        } catch (error) {
            next(error);
        }
    }

    private getTags = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        try {
            const listTags = await TagDAO.getTags();

            response.status(200).send(JSON.stringify({
                status: true,
                tags: listTags
            }, null, '\t'));
        } catch (error) {
            next(error);
        }
    }
}

export default Tag;