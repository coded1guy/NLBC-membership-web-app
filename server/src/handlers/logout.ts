import prisma from "../db";

const logout = async(req, res, next) => {
    const bearerArr:string[] = req.headers.authorization.split(' ');
    try {
        const logout = await prisma.tokens.create({
            data: {
                token: bearerArr[1],
                userId: req.user.id
            }
        })
    } catch (e) {
        return next(e);
    }
    return res.status(200).json({ message: "logged out successfully." });
}
export default logout;
