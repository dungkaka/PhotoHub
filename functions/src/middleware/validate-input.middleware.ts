const { body } = require('express-validator/check');

const validateInput = (method: any) => {
    switch (method) {

        case 'signUp': {
            return [
                body('username', `userName doesn't exists`).exists(),
                body('email', 'Invalid email').exists().isEmail(),
                body('phone').optional().isInt(),
                body('status').optional().isIn(['enabled', 'disabled'])
            ]
        }

        default:
            return;
    }

}

export default validateInput;