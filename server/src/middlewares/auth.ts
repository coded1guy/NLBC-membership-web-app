import jwt from 'jsonwebtoken';
import prisma from '../db';

const checkAuthToken = async(req, res, next) => {
    const bearer = req.headers.authorization;

    const sendError = (message) => {
        res.status(401).json({ message });
    }
    // check if the bearer token was passed to the request header
    if(!bearer) {
        sendError("Access denied! No authorization header.");
        return;
    }
    // checks if there is a token in the bearer token
    const bearerArr = bearer.split(' ');
    if(bearerArr.length !== 2) {
        sendError("Access denied! Bad authorization header.");
        return;
    }

    const token:string = bearerArr[1];
    let tokenPayload;
    // verifies if the token in the bearer token is valid
    try {
        tokenPayload = await jwt.verify(token, process.env.JWT_SECRET);
    } catch(e) {
        console.error(e);
        sendError("Access denied! Bad authorization token.");
        return;
    }
    // checks if the token is expired
    try {
        const user = await prisma.tokens.findUnique({
            where: { token }
        });
        if(user) throw new Error("New login required!");
        req.user = tokenPayload;
    } catch (e) {
        console.error(e);
        sendError("New login required!");
        return;
    }
    // delete any of the user's expired token from the database.
    try {
        const user = await prisma.tokens.delete({
            where: { userId: req.user.id }
        })
        if(!user) throw new Error("User is not blacklisted.");
    } catch(e) {
        console.error(e);
    }

    next();
}
export default checkAuthToken;
