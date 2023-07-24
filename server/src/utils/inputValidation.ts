import { body, validationResult } from "express-validator";

export const resolveValidation = (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
        res.status(404).json({ errors: errors.array() })
    } else {
        next()
    }
}

// ALL ADMIN ROUTE INPUT VALIDATION
// createAdmin route
export const createAdminInput = () => {
    const firstName = body('firstName').notEmpty().escape();
    const lastName = body('lastName').notEmpty().escape();
    const userName = body('username').notEmpty().escape();
    const email = body('email').notEmpty().isEmail().escape();
    const password = body('password').notEmpty().isStrongPassword().escape();
    const status = body('status').isIn([ 'active', 'inactive', 'deactivated' ]).escape();
    return [ firstName, lastName, userName, email, password, status ];
}
// LogAdminIn route
export const logAdminInInput = () => {
    const userName = body('username').notEmpty().escape();
    const email = body('email').notEmpty().isEmail().escape();
    const password = body('password').notEmpty().isStrongPassword().escape();
    const status = body('status').isIn([ 'active' ]).escape();
    return [ userName, email, password, status ];
}
// update admin route
export const updateAdminInput = () => {
    const firstName = body('firstName').isString().optional({nullable: true}).escape();
    const lastName = body('lastName').isString().optional({nullable: true}).escape();
    const userName = body('username').isString().optional({nullable: true}).escape();
    const email = body('email').isEmail().optional({nullable: true}).escape();
    const password = body('password').isString().isStrongPassword().optional({nullable: true}).escape();
    const status = body('status').isIn([ 'active', 'inactive', 'deactivated' ]).optional({nullable: true}).escape();
    return [ firstName, lastName, userName, email, password, status ];
}
