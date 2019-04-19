import * as express from 'express';
import Controller from "../../interfaces/controller.interface";
import AuthenicationService from "../../services/authenication/authenication.service";
import UserDTO from "../../model/user/user.dto";
import LogInDTO from "./logIn.dto";
import UserDAO from "../../model/user/user.dao";
import * as bcrypt from 'bcrypt';
import WrongCredentialsException from "../../exception/WrongCredentialsException";
import TokenData from "../../interfaces/tokenData.interface";
import DataStoredInToken from "../../interfaces/dataStoredInToken.interface";
import * as jwt from "jsonwebtoken";


class AuthenticationController implements Controller {
    public path = '/auth';
    public router = express.Router();
    public authenicationService = new AuthenicationService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes() {
        this.router.post(`${this.path}/register`, this.registration);
        this.router.post(`${this.path}/login`, this.loggingIn);
    }

    private registration = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const userDTO: UserDTO = request.body;
        console.log(userDTO);

        try {
            const { cookie, user } = await this.authenicationService.register(userDTO);
            console.log([cookie], user);

            response.setHeader('Access-Control-Allow-Credentials', 'true');
            response.setHeader('Set-Cookie', '12345');
            // response.cookie('token', "1234567859", {expires: new Date(Date.now() + 9999999)});
            response.send({
                user,
            });
        } catch (error) {
            next(error);
        }
    }

    private loggingIn = async (request: express.Request, response: express.Response, next: express.NextFunction) => {
        const logInDTO: LogInDTO = request.body;
        const userList = await UserDAO.findUserByUsername(logInDTO.username);
        const user = userList[0];
        if(user) {
            const isPasswordMatching = await bcrypt.compare(logInDTO.password, user.password);
            if(isPasswordMatching) {
                user.password = undefined;
                const tokenData = this.createToken(user);
                response.setHeader('Set-Cookie', [this.createCookie(tokenData)]);
                response.send(UserDAO.convertToUserDTO(user));
            } else {
                next(new WrongCredentialsException());
            }
        } else {
            next(new WrongCredentialsException());
        }
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly; Max-Age=${tokenData.expiresIn}`;
    }

    public createToken(user: UserDTO): TokenData {
        const expiresIn = 60*60;
        const secret = "My secret key";
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

// router.post('/login', async (request: any, response: any) => {
//     try {
//         const user = request.body;
//         const userDataQuerySnapshot = await db.collection("users").where("username", "==", user.username).where("password", "==", user.password).get();
//         const userDatas = [] as any;
//         userDataQuerySnapshot.forEach(
//             (doc) => {
//                 userDatas.push({
//                     id: doc.id,
//                     user: doc.data()
//                 })
//             }
//         );

//         response.send(JSON.stringify({
//             userDatas: userDatas,
//             token: request.user.name
//         }));


//     } catch (error) {
//         response.status(500).send(error);
//     }

// })


// router.post('/test', async (request: any, response: any) => {
//     try {
//         const data = request.body;

//         const testRef = await db.collection('test').add(data);
//         const test = await testRef.get();

//         response.send(JSON.stringify({
//             id: test.id,
//             user: data
//         }));
//     } catch (error) {
//         response.status(500).send(error);
//     }
// })

// router.get('/test', (request, response) => {
//     db.doc('test/test-one').get()
//         .then(snapshot => {
//             response.json({
//                 id: snapshot.id + "Hahaha",
//                 data: snapshot.data()
//             })
//         })
//         .catch(error => {
//             response.status(500).send(error);
//         })
// })


