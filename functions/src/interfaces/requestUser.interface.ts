import { Request } from 'express';
import UserDTO from "../model/user/user.dto";

interface RequestWithUser extends Request {
    user: UserDTO;
}

export default RequestWithUser;