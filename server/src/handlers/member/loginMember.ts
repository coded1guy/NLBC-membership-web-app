import { Prisma } from "@prisma/client";
import { comparePassword, createAuthToken } from "../../utils/auth";
import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import filterObject from "../../utils/filterObject";
import { memberScope } from ".";

// Handler for loginMember route
const loginMember = async (req, res, next) => {
    // declaring and initializing variables
    let member:object | null;
    let where:Prisma.MemberWhereUniqueInput;
    let loginType:string = "email";

    // destructuring required input values from the req.body
    const { email, phoneNumber, password } = req.body;
    
    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(memberScope, type, error);
        next(error);
    }

    /*
        there are two different ways to login to the member:
        - Using phoneNumber
        - Using email address
    */
    // setting the where object
    if(email) {
        where = { email };
        loginType = "email";
    } else if (phoneNumber) {
        where = { phoneNumber };
        loginType = "phone number";
    }

    // querying the database
    try {
        member = await prisma.member.findUnique({
            where
        })

        // if there is no member
        if(member === null) {
            throw new Error(`Didn\'t find any member with the ${loginType} provided.`);
        }
    } catch(e) {
        e.loginType = loginType;
        sendError(defineCatchType(e, "login"), e);
        return;
    }

    // check password
    try {
        const isValid = await comparePassword(password, member["password"]);
        if(!isValid) { 
            throw new Error("Member password is not correct!");
        };
    } catch(e) {
        sendError("password", e);
        return;
    }
    
    // setting member fullName
    let memberFullName:string;
    if(member["middleName"]) {
        memberFullName = `
            ${member["firstName"]} ${member["middleName"]}, ${member["lastName"]}
        `;
    } else {
        memberFullName = `${member["firstName"]} ${member["lastName"]}`;
    }
 
    const userId = member["id"];
    // success output
    return res.status(200).json({ 
        message: `Member, ${memberFullName} is logged in successfully.`, 
        data: { 
            token: createAuthToken(userId), 
            member: filterObject(member, ["password", "createdAt", "updatedAt"]) 
        } 
    })
}
export default loginMember;
