import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";
import { adminScope } from ".";

// Handler for the super admin to get an admin
export const getAnAdmin = async(req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let admin:object;

    // simple function for error handling while querying the db
    const sendError = function (type, error, message="") {
        error = defineError(adminScope, type, error, message);
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

export default getAnAdmin;
