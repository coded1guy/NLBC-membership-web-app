import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

// create authorization tokens
export const createAuthToken = (userId:string) => {
    return jwt.sign( { id: userId }, process.env.JWT_SECRET, { expiresIn: '1h' } );
}

// PASSWORDS
export const hashPassword = (password) => {
    return bcrypt.hash(password, 5);
}

export const comparePassword = (password, hash) => {
    return bcrypt.compare(password, hash);
}
