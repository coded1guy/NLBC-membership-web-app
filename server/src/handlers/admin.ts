import { Prisma } from "@prisma/client";
import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import prisma from "../db";

// Error generator
const createError = (type, message = 'admin route error.') => {
    const error = new Error(message);
    error["scope"] = "admin";
    error["type"] = type;
    return error;
}

// normal Admin Select
const adminSelect:Prisma.AdminSelect = {
    id: true,
    firstName: true,
    lastName: true,
    username: true,
    password: false,
    email: true,
    role: true,
    status: true
}

// Handler for createAdmin route
export const createAdmin = async(req, res, next) => {
    // destructuring required input values from the req.body
    const { firstName, lastName, username, email, password, status } = req.body;
    // contingency input validation
    if(!(firstName && lastName && username && email && password && status)) {
        const error = createError("noInput", "noInput");
        next(error);
        return;
    }
    let admin:object;
    // querying the database
    try {
        admin = await prisma.admin.create({
            data: {
                firstName, 
                lastName, 
                username,
                email, 
                password: await hashPassword(password), 
                status 
            }
        });
    } catch(e) {
        console.error(e);
        e.scope = "admin";
        e.type = "create";
        next(e);
        return;
    }
    const token = createJWT(admin, "admin");
    res.status(201).json({ token });
}
// Handler for logAdminIn route
export const logAdminIn = async (req, res, next) => {
    const { email, username, password } = req.body;
    // variable declaration
    let admin:object, currentAdmin:object;
    let where:Prisma.AdminWhereUniqueInput;
    // contingency input validation
    if(!(password && (email || username))) {
        const error = createError("noInput", "noInput");
        next(error);
        return;
    }
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error.scope = "admin";
        error.type = type;
        next(error);
    }
    // querying the database
    /*
        there are two different ways to login to the admin:
        - Using username
        - Using email address
    */
    if(email) {
        where = { email };
    } else if (username) {
        where = { username };
    }
    // db query
    try {
        admin = await prisma.admin.findUnique({
            where
        })
        // if there is no admin
        if(admin === null) {
            const error = createError('notExist', 'notExist');
            next(error);
            return;
        }
    } catch(e) { 
        sendError( 'notExist', e ); 
        return;
    }
    // check admin status - only admin with a status 'active' can login
    if(admin["status"] !== 'active') { 
        sendError('forbidden', new Error("Not an active admin"));
        return; 
    };
    // check password
    const isValid = await comparePassword(password, admin["password"]);
    if(!isValid) { 
        sendError('password', new Error("Incorrect password!"));
        return; 
    };
    // update the value of the lastLoggedIn
    try {
        const today = new Date();
        currentAdmin = await prisma.admin.update({
            where: { 
                id: admin["id"]
            },
            data: {
                lastLoggedIn: today.toISOString()
            },
            select: adminSelect
        })
    } catch(e) { 
        sendError('', new Error("an Error occurred while logging in."));
        return; 
    };
    // response
    res.json({ 
        message: `admin ${admin["username"]} is logged in successfully.`, 
        data: { token: createJWT(admin, "admin"), admin: currentAdmin } 
    })
}
// Handler for admin to update themselve
export const updateAdmin = async (req, res, next) => {
    const { firstName, lastName, username, email, oldPassword, password, status } = req.body;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error["scope"] = "admin";
        error["type"] = type;
        next(error);
        return
    }
    // contingency input validation
    if(!(firstName || lastName || username || email || oldPassword || password || status)) {
        sendError("noInput", new Error("no Input"));
    }
    // initialise variables
    const { id } = req.params;
    let requestBody:object = {};
    let admin:object | null, where:Prisma.AdminWhereUniqueInput;
    // checking through the allowed inputs
    if(firstName) requestBody["firstName"] = firstName;
    if(lastName) requestBody["lastName"] = lastName;
    if(username) requestBody["username"] = username;
    if(email) requestBody["email"] = email;
    if(password) requestBody["password"] = password;
    if(oldPassword) requestBody["oldPassword"] = oldPassword;
    // defining the where object
    if(!id) {
        where = { id: req.user.id };
    } else if(id) {
        where = { id };
        if(status) requestBody["status"] = status;
    }
    // making an update query
    try {
        admin = await prisma.admin.update({
            where,
            data: requestBody
        })
    } catch(e) { sendError("update", e); return; };
    // checking if there is a need for the user to re-login
    if(password || email || username) {
        res.status(200).json({ message: "Updated admin successfully. Login required!", login: true, admin: admin });
    } else {
        res.status(200).json({ message: "Updated admin successfully.", login: false, admin: admin });
    }
}
