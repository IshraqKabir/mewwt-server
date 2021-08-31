import { CustomValidator } from "express-validator";

export const validateArray: CustomValidator = async (value) => {
    if (!value) {
        return Promise.reject("Empty value passed for array");
    }

    if (!Array.isArray(value)) {
        return Promise.reject("Value must be an array");
    }

    return value;
};
