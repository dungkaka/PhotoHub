
import {firestoreRef} from "./../../config/firebase";
import UserDTO from "./user.dto";
import UserModel from "./user.model";

class UserDAO {

    private static userRef = firestoreRef.collection("users");

    public static convertToUserModel = (user: UserDTO): UserModel => {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age,
            gender: user.gender,
        }
    }

    public static convertToUserDTO = (user: UserModel): UserDTO => {
        return {
            username: user.username,
            password: user.password,
            email: user.email,
            age: user.age,
            gender: user.gender,
        }
    }

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

    public static createUserToDatabase = async (user: UserDTO, hashedPassword: string) => {
        const userModel = await UserDAO.userRef.add({
            ...UserDAO.convertToUserModel(user),
            password: hashedPassword
        });

        const userData = await userModel.get();

        return userData.data();
    }

}

export default UserDAO;

