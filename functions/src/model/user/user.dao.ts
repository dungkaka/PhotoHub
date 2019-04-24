
import {firestoreRef} from "../../config/firebase";
import UserDTO from "./user.dto";
import UserModel from "./user.model";
import SignUpDTO from "../../controller/authenication/signUp.dto";
import HttpException from "../../exception/HttpException";

class UserDAO {

    private static userRef = firestoreRef.collection("users");


    /*
    Convert from UserDTO to UserModel to communicate with Database
     */
    public static convertToUserModel = (user: SignUpDTO): UserModel => {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age?user.age:"",
            gender: user.gender?user.gender:"",
            role: user.role?user.role:"user",
        }

    }

    /*
    Convert from UserModel to UserDTO to communicate with Client
     */
    public static convertToUserDTO = (user: UserModel): UserDTO => {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age,
            gender: user.gender,
            role: user.role,
        }
    }

    /*
      Take a string as username and query in database.
      Return list of username is match;
    */
    public static findUserByUsername = async (username: string) => {
        const userDataQuerySnapshot = await
            UserDAO.userRef
                .where("username", "==", username)
                .get();

        const listUser: any[] = [];
        userDataQuerySnapshot.forEach((doc) => {
            listUser.push(doc.data());
        });

        return listUser;

    }

    /*
    Create user to datasbase. Paramater is userDTO object and password hashed.
    Then userDTO object will converted to UserModel object to communicate with database(create user to database)
    Return value is json of data user get from database.
     */
    public static createUserToDatabase = async (user: SignUpDTO, hashedPassword: string) => {

        try {
            const userModel = await UserDAO.userRef.add({
                ...UserDAO.convertToUserModel(user),
                password: hashedPassword
            });

            const userData = await userModel.get();

            return userData.data();
        } catch {
            throw new HttpException(400, "Can not register for user with valid information !");
        }


    }

}

export default UserDAO;

