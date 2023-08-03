import prisma from "../db"
import { defineError } from "../utils/defineError";

const errorScope:string = "admin", errorType:string = "access";
const error404msg:string = "An error occurred while validating permission to access this resource.";

// checks if logged in user is an admin
export const isAdmin = async(req, res, next) => {
    // error message handler
    const sendError = (error:object | null, message:string, status:number) => {
        const newError = defineError(errorScope, errorType, error, message);
        console.error(newError);
        res.status(status).json({ message, error: newError });
    }
    // check if the user id matches that of an admin
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: req.user.id
            }
        })
        if(admin === null) {
            sendError(null, "Only admins can access this resource.", 403);
            return;
        }
        if(admin.status === "active") {
            next();
        } else {
            sendError(null, "Only active admins can access this resource.", 403);
            return;
        }
    } catch (e) {
        sendError(e, error404msg, 404);
        return;
    }
}

// checks if logged in user is a super admin
export const isSuperAdmin = async(req, res, next) => {
    // error message handler
    const sendError = (error:object | null, message:string, status:number) => {
        const newError = defineError(errorScope, errorType, error, message);
        console.error(newError);
        res.status(status).json({ message, error: newError });
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
            sendError(null, "Admin is not qualifies to access this resource.", 403);
            return;
        }
    } catch (e) {
        sendError(e, error404msg, 404);
        return;
    }
}
