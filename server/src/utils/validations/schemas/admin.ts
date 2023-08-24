import Joi from "joi";
import { isPasswordValid } from "./";

// admin enum array
const AdminStatus = [ 'active', 'deactivated' ];
const Role = [ 'super', 'normal' ];

// default validation options
const firstName = Joi.string(),
    lastName = Joi.string(),
    username = Joi.string().email().optional(),
    email = Joi.string().email().optional(),
    password = Joi.string().custom(isPasswordValid).required(),
    role = Joi.string().valid(...Role).optional(),
    status = Joi.string().valid(...AdminStatus).optional()
;
const messages = {
    'password.invalid': 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
};

// SCHEMA's
// create Schema
export const createAdminSchema  = Joi.object({
    firstName: firstName.required(), 
    lastName: lastName.required(), 
    email, 
    username, 
    password, 
    role,
    status
}).or('email', 'username').messages(messages);

// login Schema
export const loginAdminSchema  = Joi.object({
    email, 
    username, 
    password, 
}).or('email', 'username').messages(messages);

// update Schema
export const updateAdminSchema  = Joi.object({
    firstName: firstName.required(), 
    lastName: lastName.required(), 
    email, 
    username, 
    role, 
    status 
});