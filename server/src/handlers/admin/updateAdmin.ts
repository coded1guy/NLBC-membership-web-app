import { Prisma } from "@prisma/client";
import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import { adminScope } from ".";

// Handler for admin to update themselve
const updateAdmin = async (req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let requestBody:object = {};
    let admin:object | null, where:Prisma.AdminWhereUniqueInput;

    // destructuring required input values from the req.body
    const { firstName, lastName, username, email, oldPassword, password, status } = req.body;
    
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(adminScope, type, error);
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
    }

    // checking if there is a need for the user to re-login
    let login:boolean, extraUpdateMsg:string = "";
    if(password || email || username) {
        extraUpdateMsg = " Login required!";
        login: true;
    } else {
        login: false;
    }
    res.status(200).json({ message: `Updated admin successfully.${extraUpdateMsg}`, login, admin: admin });
    return;
}

export default updateAdmin;
