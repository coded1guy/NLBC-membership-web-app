import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import { memberScope } from ".";

// Handler for the super admin to get a member
export const getMember = async(req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let member:object;

    // simple function for error handling while querying the db
    const sendError = function (type, error, message="") {
        error = defineError(memberScope, type, error, message);
        next(error);
    }

    // querying the database
    try {
        member = await prisma.member.findUnique({
            where: { id }
        })
        if(member === null) {
            sendError("id", null);
            return;
        }
    } catch(e) {
        sendError(defineCatchType(e, "get"), e);
        return;
    }

    // success output
    res.status(200).json({
        message: "member was gotten successfully.",
        data: member
    });
    return;
}

export default getMember;
