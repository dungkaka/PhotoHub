import * as bcrypt from 'bcrypt';
import UserDAO from "../../model/user/user.dao";
import HttpException from "../../exception/HttpException";
import SignUpDTO from "../../controller/account/signUp.dto";


class AuthenicationService {

    public async register(userSignUp: SignUpDTO) {
        if(userSignUp.username) {
            const listUser = await UserDAO.findUserByUsername(userSignUp.username);
            if (listUser.length) {
                throw new HttpException(400, `User with username ${userSignUp.username} already exist`);
            }
        } else {
            throw new HttpException(400, "Invalid Username");
        }


        if (userSignUp.password) {
            const hashedPassword = await bcrypt.hash(userSignUp.password, 10);
            const user = await UserDAO.createUserToDatabase(userSignUp, hashedPassword);
            if (user) {
                // @ts-ignore
                return {
                    user,
                };

            } else {
                throw new HttpException(400, `Register fail ! Please try it again`);
            }
        } else {
            throw new HttpException(400, "Invalid password !");
        }


    }


}

export default AuthenicationService;