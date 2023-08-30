import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import filterObject from "../../utils/filterObject";
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
            where: { id },
        })
        if(member === null) {
            return sendError("id", null);
        }
    } catch(e) {
        return sendError(defineCatchType(e, "get"), e);
    }

    // success output
    return res.status(200).json({
        message: "member was gotten successfully.",
        data: filterObject(member)
    });
}

export default getMember;
