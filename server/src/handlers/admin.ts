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
        return
    }
    // querying the database
    /*
        there are two different ways to login to the admin:
        - Using username
        - Using email address
    */
    if(email) {
        try {
            admin = await prisma.admin.findUnique({
                where: {
                    email
                }
            })
        } catch(e) { sendError( 'notExist', e ); }
    } else if (username) {
        try {
            admin = await prisma.admin.findUnique({
                where: {
                    username
                }
            })
        } catch(e) { sendError( 'notExist', e ); }
    }
    // check admin status - only admin with a status 'active' can login
    if(admin["status"] !== 'active') { sendError('forbidden', new Error("Not an active admin")) };
    // check password
    const isValid = await comparePassword(password, admin["password"]);
    if(!isValid) { sendError('password', new Error("Incorrect password!")) };
    // update the value of the lastLoggedIn
    try {
        const today = new Date();
        currentAdmin = await prisma.admin.update({
            where: { 
                email: admin["email"]
            },
            data: {
                lastLoggedIn: today.toISOString()
            }
        })
    } catch(e) { sendError('', new Error("an Error occurred while logging in.")) };
    // response
    res.json({ 
        message: `admin ${admin["username"]} is logged in successfully.`, 
        data: { token: createJWT(admin, "admin"), user: currentAdmin } 
    })
}
// Handler for admin to update themselve
export const updateAdmin = async (req, res, next) => {
    const { firstName, lastName, username, email, password, status } = req.body;
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error["scope"] = "admin";
        error["type"] = type;
        next(error);
        return
    }
    // contingency input validation
    if(!(firstName || lastName || username || email || password || status)) {
        sendError("noInput", new Error("no Input"));
    }
    // initialise variables
    const { id } = req.params;
    let admin:object | null, where:Prisma.AdminWhereUniqueInput;
    // defining the where object
    if(!id) {
        where = { id: req.user.id };
    } else if(id) {
        where = { id };
    }
    // making an update query
    try {
        admin = await prisma.admin.update({
            where,
            data: req.body
        })
    } catch(e) { sendError("update", e) };
    // checking if there is a need for the user to re-login
    if(password || email || username) {
        res.status(200).json({ message: "Updated admin successfully. Login required!", login: true, admin: admin });
    } else {
        res.status(200).json({ message: "Updated admin successfully.", login: false, admin: admin });
    }
}
