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
import authMiddleware from "../../middleware/AuthMiddleware";
import RequestWithUser from "../../interfaces/requestUser.interface";
import validationMiddleware from "../../middleware/ValidateMiddleware";
import keyJWT from "../../config/keyJWT";


class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    public authenicationService = new AuthenicationService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, authMiddleware, this.loggingIn);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userDTO: UserDTO = request.body;
        console.log(request.headers);
        try {
            const { user } = await this.authenicationService.register(userDTO);
            const tokenData = this.createToken(user);

            // response.setHeader('Set-Cookie', cookie);
            // response.cookie('token', "1234567859", {expires: new Date(Date.now() + 99999999)});

            response.send(JSON.stringify({
                user: user,
                token: tokenData

            }, null, '\t'));

        } catch (error) {
            response.send({
                status: error.status,
                message: error.message,
            });
        }
    }

    private loggingIn = async (request: RequestWithUser, response: express.Response, next: express.NextFunction) => {
        const logInDTO: LogInDTO = request.body;
        const userList = await UserDAO.findUserByUsername(logInDTO.username);
        const user = userList[0];
        if(user) {
            const isPasswordMatching = await bcrypt.compare(logInDTO.password, user.password);
            if(isPasswordMatching) {

                user.password = undefined;
                const tokenData = this.createToken(user);
                // response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                response.send(JSON.stringify({
                    user: UserDAO.convertToUserDTO(user),
                    token: tokenData.token,
                    claim: request.user.username,
                }, null, '\t'));

            } else {
                response.status(400).send({
                    message: "Check user and password !"
                })
            }
        } else {
            response.status(400).send({
                message: "Check user and password !"
            })
        }
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly=false; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: UserDTO): TokenData {
        const expiresIn = 60*60;
        const secret = keyJWT;
        const dataStoreInToken: DataStoredInToken = {
            username: user.username,
        }

        return {
            expiresIn,
            token: jwt.sign(dataStoreInToken, secret, {expiresIn}),
        }
    }

}

export default AuthenticationController;


