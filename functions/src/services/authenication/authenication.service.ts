import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import TokenData from "../../interfaces/tokenData.interface";
import DataStoredInToken from "../../interfaces/dataStoredInToken.interface";
import UserDao from "../../model/user/user.dao";
import UserWithUsernameAlreadyExistException from "../../exception/userWithUsernameAlreadyExistException";
import UserDTO from "../../model/user/user.dto";
import UserDAO from "../../model/user/user.dao";


class AuthenicationService {

    public async register(userDTO: UserDTO) {

        const listUser = await UserDao.findUserByUsername(userDTO.username);
        if (listUser.length) {
            throw new UserWithUsernameAlreadyExistException(userDTO.username);
        }

        const hashedPassword = await bcrypt.hash(userDTO.password, 10);
        const userModel = await UserDao.createUserToDatabase(userDTO, hashedPassword);

        if(userModel) {
            userModel.password = undefined;
            // @ts-ignore
            const user: UserDTO = UserDAO.convertToUserDTO(userModel);

            const tokenData = this.createToken(user);
            const cookie = this.createCookie(tokenData);

            return {
                cookie,
                user,
            };

        } else {
            throw new class implements Error {
                message: string = "No account";
                name: string = "No account";
                stack: string = "No account";
            }
        }
    }

    public createCookie(tokenData: TokenData) {
        return `Authorization=${tokenData.token}; HttpOnly=false; Max-Age=${tokenData.expiresIn}`;
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

export default AuthenicationService;