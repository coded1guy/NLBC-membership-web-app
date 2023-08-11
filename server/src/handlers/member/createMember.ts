import { createJWT, hashPassword } from "../../utils/auth";
import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import { memberScope } from ".";

// Handler for createMember route
const createMember = async(req, res, next) => {
    // declaring and initializing variables
    let member:object;
    
    // destructuring required input values from the req.body
    const { 
        profileImageUrl, firstName, middleName, lastName, age, 
        email, phoneNumber, address, password, membershipStatus, 
        employmentStatus, maritalStatus, dateOfBirth, anniversary 
    } = req.body;

    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(memberScope, type, error);
        next(error);
    }

    // querying the database
    try {
        member = await prisma.member.create({
            data: {
                profileImageUrl, 
                firstName, 
                middleName, 
                lastName, 
                age, 
                email, 
                phoneNumber, 
                address, 
                password: await hashPassword(password), 
                membershipStatus, 
                employmentStatus, 
                maritalStatus, 
                dateOfBirth, 
                anniversary
            }
        });
    } catch(e) {
        sendError(defineCatchType(e, "create"), e);
        return;
    }

    // success output
    const token = createJWT(member, "member");
    res.status(201).json({ token });
    return;
}

export default createMember;
