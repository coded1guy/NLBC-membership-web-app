import { Prisma } from "@prisma/client";
import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import prisma from "../db";
import { defineError, defineCatchType } from "../utils/defineError";

// declared error scope
const scope = "admin";

// Handler for createAdmin route
export const createAdmin = async(req, res, next) => {
    // declaring and initializing variables
    let admin:object;
    // destructuring required input values from the req.body
    const { firstName, lastName, username, email, password, status, role } = req.body;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(scope, type, error);
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

// Handler for logAdminIn route
export const logAdminIn = async (req, res, next) => {
    // declaring and initializing variables
    let admin:object | null, currentAdmin:object;
    let where:Prisma.AdminWhereUniqueInput;
    let loginType:string = "email";
    // destructuring required input values from the req.body
    const { email, username, password } = req.body;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(scope, type, error);
        next(error);
    }
    /*
        there are two different ways to login to the admin:
        - Using username
        - Using email address
    */
    // setting the where object
    if(email) {
        where = { email };
        loginType = "email";
    } else if (username) {
        where = { username };
        loginType = "username";
    }
    // querying the database
    try {
        admin = await prisma.admin.findUnique({
            where
        })
        // if there is no admin
        if(admin === null) {
            throw new Error(`Didn\'t find any admin with the ${loginType} provided.`);
        }
    } catch(e) {
        e.loginType = loginType;
        sendError(defineCatchType(e, "login"), e);
        return;
    }
    // check admin status - only admin with a status 'active' can login
    if(admin["status"] !== 'active') { 
        sendError("forbidden", null);
        return;
    };
    // check password
    try {
        const isValid = await comparePassword(password, admin["password"]);
        if(!isValid) { 
            throw new Error("Admin password is not correct!");
        };
    } catch(e) {
        sendError("password", e);
        return;
    }
    // update the value of the lastLoggedIn
    try {
        const today:Date = new Date();
        currentAdmin = await prisma.admin.update({
            where: { 
                id: admin["id"]
            },
            data: {
                lastLoggedIn: today.toISOString()
            },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                username: true,
                password: false,
                email: true,
                role: true,
                status: true
            }
        })
    } catch(e) { 
        sendError(defineCatchType(e, "get"), e);
        return;
    };
    // success output
    res.json({ 
        message: `admin ${admin["username"]} is logged in successfully.`, 
        data: { token: createJWT(admin, "admin"), admin: currentAdmin } 
    })
    return;
}

// Handler for admin to update themselve
export const updateAdmin = async (req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let requestBody:object = {};
    let admin:object | null, where:Prisma.AdminWhereUniqueInput;
    // destructuring required input values from the req.body
    const { firstName, lastName, username, email, oldPassword, password, status } = req.body;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(scope, type, error);
        next(error);
    }
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
    } catch(e) {
        sendError(defineCatchType(e, "update"), e);
        return;
    };
    // checking if there is a need for the user to re-login
    let login:boolean, extraUpdateMsg:string;
    if(password || email || username) {
        extraUpdateMsg = " Login required!";
        login: true;
    } else {
        login: false;
    }
    res.status(200).json({ message: `Updated admin successfully.${extraUpdateMsg}`, login, admin: admin });
    return;
}
// Handler for the super admin to get an admin
export const getAnAdmin = async(req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let admin:object;
    // simple function for error handling while querying the db
    const sendError = function (type, error, message="") {
        error = defineError(scope, type, error, message);
        next(error);
    }
    // querying the database
    try {
        admin = await prisma.admin.findUnique({
            where: { id }
        })

        if(admin === null) {
            sendError("id", null);
            return;
        }
    } catch(e) {
        sendError(defineCatchType(e, "get"), e);
        return;
    }
    // success output
    res.status(200).json({
        message: "Admin was gotten successfully.",
        data: admin
    });
    return;
}
// Handler for the super admin to get all admins
export const getAllAdmin = async(req, res, next) => {
    // declaring and initializing variables
    let admin;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(scope, type, error);
        next(error);
    }
    // querying the database
    try {
        admin = await prisma.admin.findMany();

        if(admin === null) {
            sendError("noList", null);
            return;
        }
    } catch(e) {
        sendError(defineCatchType(e, "get"), e);
        return;
    }
    // success output
    res.status(200).json({
        message: "Admin list was gotten successfully.",
        data: admin
    });
    return;
}
// Handler for the super admin to delete an admin
export const deleteAnAdmin = async(req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let admin:object | null;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(scope, type, error);
        next(error);
    }
    // querying the database
    try {
        admin = await prisma.admin.delete({
            where: { id }
        })

        if(admin === null) {
            sendError("id", null);
            return;
        }
    } catch(e) {
        sendError(defineCatchType(e, "delete"), e);
        return;
    }
    // success output
    res.status(200).json({
        message: "Admin was deleted successfully.",
        data: admin
    });
    return;
}
