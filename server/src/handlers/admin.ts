import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import prisma from "../db";

export const createAdmin = async(req, res) => {
    const { 
        firstName,  
        lastName, 
        username, 
        email, 
        password, 
        status
    } = req.body;
    console.log(req.body)
    const user = await prisma.admin.create({
        data: {
            firstName, 
            lastName, 
            username,
            email, 
            password: await hashPassword(password), 
            status 
        }
    })

    const token = createJWT("admin", user);
    res.json({ token })
}

export const logAdminIn = async (req, res) => {
    const {
        email, 
        // username, 
        password
    } = req.body;

    const admin = await prisma.admin.findUnique({
        where: {
            email
        }
    })

    const isValid = await comparePassword(password, admin.password);

    if(!isValid) {
        res.status(401)
        res.json({ message: "Password is not correct. Try again." })
        return
    }

    res.json({ 
        message: `admin ${admin.username} is logged in successfully.`, 
        data: { token: createJWT("admin", admin), user: admin } 
    })
}
