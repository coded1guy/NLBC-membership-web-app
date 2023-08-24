import prisma from "../db"
import { defineError } from "../utils/defineError";
import { adminScope } from "../handlers/admin";

const error404msg:string = "An error occurred while validating permission to access this resource.";

// checks if logged in user is an admin
export const isAdmin = async(req, res, next) => {
    // error message handler
    const sendError = (type, error:object | null, message:string="") => {
        const newError = defineError(adminScope, type, error, message);
        next(newError);
    }
    // check if the user id matches that of an admin
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: req.user.id
            }
        })
        if(admin === null) {
            sendError("forbidden", null, "Only admins can access this resource.");
            return;
        }
        if(admin.status === "active") {
            next();
        } else {
            sendError("forbidden", null, "Only active admins can access this resource.");
            return;
        }
    } catch (e) {
        sendError("Network", e, error404msg);
        return;
    }
}

// checks if logged in user is a super admin
export const isSuperAdmin = async(req, res, next) => {
    // error message handler
    const sendError = (type, error:object | null, message:string="") => {
        const newError = defineError(adminScope, type, error, message);
        next(newError);
    }
    // checks if the admin role is super
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: req.user.id
            }
        })
        if(admin.role === "super") {
            next();
        } else {
            sendError("forbidden", null, "Admin is not qualified to access this resource.");
            return;
        }
    } catch (e) {
        sendError("Network", e, error404msg);
        return;
    }
}
