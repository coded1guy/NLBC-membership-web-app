import prisma from "../db"
// must be admin protector
export const mustBeMaster = async(req, res, next) => {
    try {
        const admin = await prisma.admin.findUnique({
            where: {
                id: req.user.id
            }
        })

        if(admin.role === "super") {
            next();
        } else {
            res.status(403).json({ message: "You are not allowed to access this resource." });
            return;
        }
    } catch (e) {
        res.status(404);
        res.json(
            { message: "An error occurred while validating permission to access this resource" }
        );
    }
}
