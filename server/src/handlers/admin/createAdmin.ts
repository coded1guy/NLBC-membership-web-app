import { createJWT, hashPassword } from "../../utils/auth";
import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import { adminScope } from ".";

// Handler for createAdmin route
const createAdmin = async(req, res, next) => {
    // declaring and initializing variables
    let admin:object;
    
    // destructuring required input values from the req.body
    const { firstName, lastName, username, email, password, status, role } = req.body;

    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(adminScope, type, error);
        next(error);
    }

    // querying the database
    try {
        admin = await prisma.admin.create({
            data: {
                firstName, 
                lastName, 
                username, 
                email, 
                password: await hashPassword(password), 
                status,
                role 
            }
        });
    } catch(e) {
        sendError(defineCatchType(e, "create"), e);
        return;
    }

    // success output
    const token = createJWT(admin, "admin");
    res.status(201).json({ token });
    return;
}

export default createAdmin;
