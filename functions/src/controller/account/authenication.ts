import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import AuthenicationService from "../../services/authenication/authenication.service";
import UserDTO from "../../model/user/user.dto";
import LogInDTO from "./logIn.dto";
import UserDAO from "../../model/user/user.dao";
import * as bcrypt from 'bcrypt';
import TokenData from "../../interfaces/tokenData.interface";
import DataStoredInToken from "../../interfaces/dataStoredInToken.interface";
import * as jwt from "jsonwebtoken";
import keyJWT from "../../config/keyJWT";
import HttpException from "../../exception/HttpException";
import SignUpDTO from "./signUp.dto";
import UserModel from "../../model/user/user.model";
import validateInput from "../../middleware/validate-input.middleware";
import validationHandler from "../../middleware/validation-handler";
import InitDefault from "./initDefault";
import RequestWithUser from "../../interfaces/requestUser.interface";
import authMiddleware from "../../middleware/auth.middleware";

class AuthenticationController implements Controller {
    public path = '';
    public router = express.Router();
    public authenicationService = new AuthenicationService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        // this.router.use(function(req, res, next) {
        //     res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
        //     res.header("Access-Control-Allow-Headers","*");
        //     res.header('Access-Control-Allow-Credentials', "true");
        //     res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
        //     next();
        // });

        // @ts-ignore
        this.router.post(`${this.path}/signup`, validateInput('signUp'), this.registration);
        this.router.post(`${this.path}/login`, this.loggingIn);
        // @ts-ignore
        this.router.get(`${this.path}/auth/me`, authMiddleware,this.getUser);
        // @ts-ignore
        this.router.get(`${this.path}/users`, authMiddleware, this.getListOfUser);
        // @ts-ignore
        this.router.put(`${this.path}/users`, authMiddleware, this.updateUser);
        // @ts-ignore
        this.router.delete(`${this.path}/users`, authMiddleware, this.deleteUser);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        try {
            // @ts-ignore
            const result = await request.getValidationResult();
            validationHandler(result);

            const userSignUp: SignUpDTO = request.body;
            const { user } = await this.authenicationService.register(userSignUp);

            const userDTO: UserDTO = UserDAO.convertToUserDTO(user);
            userDTO.password = undefined;

            // response.setHeader('Set-Cookie', cookie);
            response.cookie('token', "1234567859", {expires: new Date(Date.now() + 99999999)});
            await response.status(200).send(JSON.stringify({
                status: true,
                user: userDTO,

            }, null, '\t'));

            const initDefault = new InitDefault(user);
            await initDefault.init();

        } catch (error) {
            response.status(400).send({
                status: false,
                code: error.status,
                message: error.message,
            });
        }
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInDTO: LogInDTO = request.body;
        const userList = await UserDAO.findUserByUsername(logInDTO.username);
        const userModel: UserModel = userList[0];
        try {
            if(userModel) {
                const isPasswordMatching = await bcrypt.compare(logInDTO.password, userModel.password);
                if(isPasswordMatching) {
                    const userDTO: UserDTO = UserDAO.convertToUserDTO(userModel);
                    userDTO.password = undefined;
                    const tokenData = this.createToken(userModel);
                    // response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);

                    response.status(200).send(JSON.stringify({
                        status: true,
                        access_token: tokenData.token,
                        user: userDTO,
                    }, null, '\t'));

                } else {
                    throw new HttpException(400, "Check Username or Password");
                }
            } else {
                throw new HttpException(400, "Check Username or Password");
            }
        } catch (error) {
            response.status(400).send(JSON.stringify({
                status: false,
                code: error.status,
                message: error.message,
            }, null, '\t'))
        }

    };

    private getUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const user = request.user;

        try {
            if(user) {
                const userDTO = UserDAO.convertToUserDTO(user);
                userDTO.password = undefined;
                response.status(200).send(JSON.stringify({
                    user: userDTO,
                }, null, "\t"));
            } else {
                throw new HttpException(400, "Wrong user !");
            }
        } catch (error) {
            next(error);
        }
    };

    private getListOfUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {

        try {
            const listOfUser = await UserDAO.getListOfUser();
            for(const user of listOfUser) {
                user.password = undefined;
            }
            response.status(200).send(JSON.stringify({
                users:  listOfUser,
            }, null, "\t"));
        } catch (error) {
            next(error);
        }
    };

    private updateUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {

        const userUpdate = request.body;

        try {
            const userUpdateStatus = await UserDAO.updateUser(userUpdate);

            response.send(JSON.stringify({
                status: true,
                message: userUpdateStatus.message,
            }, null, "\t"));

        } catch (error) {
            next(error);
        }
    };

    private deleteUser = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {

        const userDelete = request.body;

        try {
            const userUpdateStatus = await UserDAO.deleteUser(userDelete);

            response.send(JSON.stringify({
                status: true,
                message: userUpdateStatus.message,
            }, null, "\t"));

        } catch (error) {
            next(error);
        }
    };


    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly=false; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: UserModel): TokenData {
        const expiresIn = 60*60*60*24;
        const secret = keyJWT;
        const dataStoreInToken: DataStoredInToken = {
            username: user.username,
            role: user.role,
        }

        return {
            expiresIn,
            token: jwt.sign(dataStoreInToken, secret, {expiresIn}),
        }
    }

}

export default AuthenticationController;


