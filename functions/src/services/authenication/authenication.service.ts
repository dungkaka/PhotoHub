import * as bcrypt from 'bcrypt';
import UserDTO from "../../model/user/user.dto";
import UserDAO from "../../model/user/user.dao";
import HttpException from "../../exception/HttpException";
import SignUpDTO from "../../controller/authenication/signUp.dto";


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
            const userModel = await UserDAO.createUserToDatabase(userSignUp, hashedPassword);
            if (userModel) {
                // @ts-ignore
                const user: UserDTO = UserDAO.convertToUserDTO(userModel);
                user.password = undefined;

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