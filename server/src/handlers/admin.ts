import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import prisma from "../db";

// Handler for createAdmin route
export const createAdmin = async(req, res) => {
    // destructuring required input values from the req.body
    const { 
        firstName,  
        lastName, 
        username, 
        email, 
        password, 
        status
    } = req.body;
    // contingency input validation
    if(
        !firstName && !lastName && !username && 
        !email && !password && !status
    ) {
        res.status(400).json({ message: "Required inputs are not provided!" });
    }
    let user:object;
    // querying the database
    try {
        user = await prisma.admin.create({
            data: {
                firstName, 
                lastName, 
                username,
                email, 
                password: await hashPassword(password), 
                status 
            }
        });
    } catch(e) {
        console.error(e);
        res.status(409);
        res.json({ message: "A user with the same unique value already exist.", error: e });
        return;
    }
    const token = createJWT("admin", user);
    res.status(201).json({ token });
}
// Handler for logAdminIn route
export const logAdminIn = async (req, res) => {
    const {
        email, 
        username, 
        password,
    } = req.body;
    // variable declaration
    let admin, currentAdmin;
    // contingency input validation
    if(!password && !(email || username)) {
        res.status(400).json({ message: "Required inputs are not provided!" });
    }
    // simple function for error handling while querying the db
    const sendError = function (res, error) {
        res.status(404)
        res.json({ message: "admin does not exist", error: error })
        return
    }
    // querying the database
    /*
        there are two different ways to login to the admin:
        - Using username
        - Using email address
    */
    if(email) {
        try {
            admin = await prisma.admin.findUnique({
                where: {
                    email
                }
            })
        } catch(e) { sendError(res, e); }
    } else if (username) {
        try {
            admin = await prisma.admin.findUnique({
                where: {
                    username
                }
            })
        } catch(e) { sendError(res, e); }
    }
    // check password
    const isValid = await comparePassword(password, admin.password);
    if(!isValid) {
        res.status(401)
        res.json({ message: "Password is not correct. Try again." })
        return
    }
    // update the value of the lastLoggedIn
    const today = new Date();
    try {
        currentAdmin = await prisma.admin.update({
            where: { 
                email: admin.email
            },
            data: {
                lastLoggedIn: today.toISOString()
            }
        })
    } catch(e) {
        console.error(e);
    }
    // response
    res.json({ 
        message: `admin ${admin.username} is logged in successfully.`, 
        data: { token: createJWT("admin", admin), user: currentAdmin } 
    })
}
// Handler for Updating an admin
export const updateAdmin = async (req, res) => {
    const { firstName, lastName, username, email, password, status } = req.body;
    // contingency input validation
    if(!(firstName || lastName || username || email || password || status)) {
        res.status(400).json({ message: "No input for update was provided!" })
        return;
    }
    let admin;
    try {
        admin = await prisma.admin.update({
            where: {
                id: req.user.id
            },
            data: req.body
        })
    } catch(e) {
        console.error(e);
        res.status(404).json({ message: "couldn't update admin!", error: e });
        return;
    }
    if(password || email || username) {
        res.status(200).json({ message: "Updated admin successfully. Login required!", login: true, admin: admin });
    } else {
        res.status(200).json({ message: "Updated admin successfully.", login: false, admin: admin });
    }
}
