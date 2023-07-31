import { param, validationResult } from "express-validator";

export const resolveValidation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(400).json({ message: "Invalid Inputs.", errors: errors.array() })
    } else {
        next()
    }
}

export const paramsValidation = [
    // parameter input
    param('id', 'An Id must be provided!').notEmpty().isString().withMessage('Invalid id!'),
]
