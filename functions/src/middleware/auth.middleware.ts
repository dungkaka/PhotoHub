import {NextFunction, Response} from 'express';
import * as jwt from 'jsonwebtoken';
import keyJWT from "../config/keyJWT";
import RequestWithUser from "../interfaces/requestUser.interface";
import DataStoredInToken from "../interfaces/dataStoredInToken.interface";
import UserDAO from "../model/user/user.dao";
import AuthenticationTokenMissingException from "../exception/AuthenticationTokenMissingException";
import WrongAuthenticationTokenException from "../exception/WrongAuthenticationTokenException";

const authMiddleware = async (request: RequestWithUser, response: Response, next: NextFunction) => {
    if ((!request.headers.authorization || !request.headers.authorization.startsWith('Bearer '))) {
        next(new AuthenticationTokenMissingException());
    }

    // @ts-ignore
    const idToken = request.headers.authorization.split('Bearer ')[1];
    const secret = keyJWT;
    try {
        const verificationResponse = jwt.verify(idToken, secret) as DataStoredInToken;
        const username = verificationResponse.username;
        const user = await UserDAO.findUserByUsername(username);
        if (user.length) {
            request.user = user[0];
            next();
        } else {
            next(new WrongAuthenticationTokenException());
        }
    } catch (error) {
        next(new WrongAuthenticationTokenException());
    }

}

export default authMiddleware;