
import {firestoreRef} from "../../config/firebase";
import UserDTO from "./user.dto";
import UserModel from "./user.model";
import SignUpDTO from "../../controller/account/signUp.dto";
import HttpException from "../../exception/HttpException";

class UserDAO {
    private static userRef = firestoreRef.collection("users");

    /*
    Convert from UserDTO to UserModel to communicate with Database
     */
    public static convertToUserModel = (user: any): UserModel => {
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
    public static convertToUserDTO = (user: any): UserDTO => {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age,
            gender: user.gender,
            role: user.role,
        }
    };

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
            listUser.push({...doc.data(), id: doc.id});
        });

        return listUser;

    };

    public static getListOfUser = async () => {
        const userDataQuerySnapshot = await
            UserDAO.userRef.get();
        const listUser: any[] = [];
        userDataQuerySnapshot.forEach((doc) => {
            listUser.push({...doc.data(), id: doc.id});
        });

        return listUser;
    };

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

            return {...userData.data(), id: userData.id};
        } catch {
            throw new HttpException(400, "Can not register for user with valid information !");
        }
    }

    public static updateUser = async (user: any) => {

        const userRef = UserDAO.userRef.doc(user.id);


        if(userRef) {
            delete user.id;
            await userRef.set(user, {
                merge: true,
            });
        } else {
            throw new HttpException(400, "User doesn't exist !");
        }

        return {
            message: "Update user successfully !"
        }

    };

    public static deleteUser = async (user: any) => {
        const userRef = UserDAO.userRef.doc(user.id);

        if(userRef) {
            await userRef.delete();
        } else {
            throw new HttpException(400, "User doesn't exist !");
        }

        return {
            message: "Delete user successfully !"
        }

    };


}

export default UserDAO;

