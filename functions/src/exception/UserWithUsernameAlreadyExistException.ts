import HttpException from './HttpException';

class UserWithUsernameAlreadyExistException extends HttpException {
    constructor(username: string) {
        super(400, `User with username ${username} already exists`);
    }
}

export default UserWithUsernameAlreadyExistException;
