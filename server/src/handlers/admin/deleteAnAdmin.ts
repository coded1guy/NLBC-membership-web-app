import { adminScope } from ".";
import prisma from "../../db";
import { defineError, defineCatchType } from "../../utils/defineError";

// Handler for the super admin to delete an admin
const deleteAnAdmin = async(req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let admin:object | null;

    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(adminScope, type, error);
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

export default deleteAnAdmin;
