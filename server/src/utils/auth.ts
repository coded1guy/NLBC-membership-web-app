import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createJWT = (user:object, type:string = "member") => {
    let userObject:object;
    if(type === "admin") {
        userObject = { id: user["id"], username: user["username"], email: user["email"] };
    } else {
        userObject  = { id: user["id"], email: user["email"] };
    }
    return jwt.sign( userObject, process.env.JWT_SECRET, { expiresIn: '1h' } );
}

export const checkAuthorization = (req, res, next) => {
    const bearer = req.headers.authorization;

    const sendError = (message) => {
        res.status(401).json({ message });
        return;
    }

    if(!bearer) {
        sendError("Access denied! No authorization header.");
    }

    const bearerArr = bearer.split(' ');
    if(bearerArr.length !== 2) {
        sendError("Access denied! Bad authorization header.");
    }

    try {
        const payload = jwt.verify(bearerArr[1], process.env.JWT_SECRET);
        req.user = payload;
        next();

    } catch(e) {
        console.error(e);
        sendError("Access denied! Bad authorization token.");
    }
}

// PASSWORDS
export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
}

export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}
