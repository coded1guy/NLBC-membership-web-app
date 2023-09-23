import { Prisma } from "@prisma/client";
import { comparePassword, createAuthToken } from "../../utils/auth";
import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import { adminScope } from ".";

// Handler for logAdminIn route
const logAdminIn = async (req, res, next) => {
    // declaring and initializing variables
    let admin:object | null, currentAdmin:object;
    let where:Prisma.AdminWhereUniqueInput;
    let loginType:string = "email";

    // destructuring required input values from the req.body
    const { email, username, password } = req.body;
    
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(adminScope, type, error);
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

    const userId:string = admin["id"];
    // success output
    res.json({ 
        message: `Admin ${admin["username"]} is logged in successfully.`, 
        data: { token: createAuthToken(userId), admin: currentAdmin } 
    })
    return;
}

export default logAdminIn;
