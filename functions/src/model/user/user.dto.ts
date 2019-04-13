import {IsString} from 'class-validator';

class User {
    @IsString()
    public name: string | undefined;

    @IsString()
    public email: string | undefined;

    @IsString()
    public password: string | undefined;

}

export default User;