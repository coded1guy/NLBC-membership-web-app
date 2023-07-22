import { comparePassword, createJWT, hashPassword } from "../utils/auth";
import prisma from "../db";

export const createMember = async(req, res) => {
    const { 
        firstName, 
        middleName, 
        lastName, 
        age, 
        email, 
        phoneNumber, 
        address, 
        password, 
        membershipStatus, 
        employmentStatus, 
        maritalStatus, 
        dateOfBirth, 
        anniversary
    } = req.body;
    const user = await prisma.member.create({
        data: {
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
    })

    const token = createJWT("member", user);
    res.json({ token })
}

export const logMemberIn = async (req, res) => {
    const {
        email, 
        // phoneNumber, 
        password
    } = req.body;

    const member = await prisma.member.findUnique({
        where: {
            email
        }
    })

    const isValid = await comparePassword(password, member.password);

    if(!isValid) {
        res.status(401)
        res.json({ message: "Password is not correct. Try again." })
        return
    }

    res.json({ message: { token: createJWT("member", member), member } })
}
