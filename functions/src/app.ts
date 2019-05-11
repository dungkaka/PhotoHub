import * as express from 'express';
import * as bodyParser from 'body-parser';
import Controller from "./interfaces/controller.interface";
import cookieParser = require("cookie-parser");
import * as cors from 'cors';

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
        this.app.use(cors());
        this.app.use(function(req, res, next) {
            res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
            res.header("Access-Control-Allow-Headers","*");
            res.header('Access-Control-Allow-Credentials', "true");
            res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
            next();
        });
    }

    private initializeControllers(controllers: Controller[]) {
        controllers.forEach((controller) => {
            this.app.use('/api/v1', controller.router);
        });

    }


    // private initializeTriggerStorage() {
    //
    // }

}

export default App;
