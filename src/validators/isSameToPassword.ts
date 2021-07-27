import { CustomValidator, Meta } from "express-validator";

export const isSameToPassword: CustomValidator = (value: string, { req, location, path }: Meta) => {
    const passes = value === req.body.password;

    if (!passes) {
        return Promise.reject(`Confirm Password doesn't match`);
    }

    return value;
}