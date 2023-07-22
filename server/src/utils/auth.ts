import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

export const createJWT = (type, user) => {
    if(type === "admin") {
        return jwt.sign(
            { id: user.id, username: user.username, email: user.email },
            process.env.JWT_SECRET
        )
    } else if(type === "member") {
        return jwt.sign(
            { id: user.id, email: user.email },
            process.env.JWT_SECRET
        )
    }
}

export const checkAuthorization = (req, res, next) => {
    const bearer = req.headers.authorization;

    if(!bearer) {
        res.status(401);
        res.json({ message: "Access denied! No authorization header." });
        return;
    }

    const bearerArr = bearer.split(' ');
    if(bearerArr.length !== 2) {
        res.status(401);
        res.json({ message: "Access denied! Bad authorization header." });
        return;
    }

    try {
        const payload = jwt.verify(bearerArr[1], process.env.JWT_SECRET);
        req.user = payload;
        next();

    } catch(e) {
        console.error(e);
        res.status(401);
        res.json({ message: "Access denied! Bad authorization token." });
        return;
    }
}

// PASSWORDS
export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
}

export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}
