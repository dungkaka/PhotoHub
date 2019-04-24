import { Request } from 'express';
import UserModel from "../model/user/user.model";

interface RequestWithUser extends Request {
    user: UserModel;
}

export default RequestWithUser;