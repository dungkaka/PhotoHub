import HttpException from "../exception/HttpException";

const validationHandler = (result: any) => {
    if (result.isEmpty()) return;
    throw new HttpException(400,
        result.array().map((i: any) => `'${i.param}' has ${i.msg}`).join('')
    );
};

export default validationHandler;