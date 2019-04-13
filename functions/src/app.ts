import * as express from 'express';
import * as bodyParser from 'body-parser';
import Controller from "./controller/interfaces/controller.interface";
import cookieParser = require("cookie-parser");

class App {
    public app: express.Application;

    constructor(controllers: Controller[]) {
        this.app = express();

        this.initializeMiddlewares();
        this.initializeControllers(controllers);
    }

    private initializeMiddlewares() {
        this.app.use(bodyParser.json());
        this.app.use(cookieParser());
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1', controller.router);
        });
    }

}

export default App;