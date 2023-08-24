import Joi from "joi";

// general id schema
export const userIdSchema = Joi.string().uuid().required();

// Define a custom validation function for the password
export const isPasswordValid = (value, helpers) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\-]).*$/;
    if (value.length < 6 || !regex.test(value)) {
      return helpers.error('password.invalid');
    }
    return value;
};
