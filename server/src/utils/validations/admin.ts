import { body } from "express-validator";

// ALL ADMIN ROUTE INPUT VALIDATION
// createAdmin route
export const createAdminInputValidation = [
    body('firstName', 'First name is required!').notEmpty().isString().escape().withMessage('First name must be a string!'),
    body('lastName', 'Last name is required!').notEmpty().isString().escape().withMessage('Last name must be a string!'),
    body('username', 'Username is required!').notEmpty().escape().withMessage('Username must be a string!'),
    body('email', 'Email is required!').notEmpty().isEmail().escape().withMessage('Not a valid email address!'),
    body('password', 'Password is required!').notEmpty().isStrongPassword().escape().withMessage('Password is not strong enough!'),
    body('status', 'Status is required!').isIn([ 'active', 'inactive', 'deactivated' ]).escape().withMessage('Status must be a string and have a value of \'active\', \'inactive\' or \'deactivated\'!')
];
// LogAdminIn route
export const logAdminInInputValidation = [
    body('username', 'Username is required!').notEmpty().escape().withMessage('Username must be a string!'),
    body('email', 'Email is required!').notEmpty().isEmail().escape().withMessage('Not a valid email address!'),
    body('password', 'Password is required!').notEmpty().isStrongPassword().escape().withMessage('Password is not strong enough!'),
    body('status', 'Status is required!').isIn([ 'active', 'inactive', 'deactivated' ]).escape().withMessage('Status must be a string and have a value of \'active\', \'inactive\' or \'deactivated\'!')
];
// update admin route
// export const updateAdminInput = () => {
//     const firstName = body('firstName').isString().optional({nullable: true}).escape();
//     const lastName = body('lastName').isString().optional({nullable: true}).escape();
//     const userName = body('username').isString().optional({nullable: true}).escape();
//     const email = body('email').isEmail().optional({nullable: true}).escape();
//     const password = body('password').isString().isStrongPassword().optional({nullable: true}).escape();
//     const status = body('status').isIn([ 'active', 'inactive', 'deactivated' ]).optional({nullable: true}).escape();
//     return [ firstName, lastName, userName, email, password, status ];
// }
