import { body } from "express-validator";

// ALL MEMBER ROUTE INPUT VALIDATION
// createMember route
export const createMemberInputValidation = [
    body('profileImageUrl').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('profile image url must be a string.'),

    body('firstName', 'First name is required.').notEmpty().isString().escape()
    .withMessage('First name must be a string.'),

    body('middleName').notEmpty().isString().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Middle name must be a string.'),

    body('lastName', 'Last name is required.').notEmpty().isString().escape()
    .withMessage('Last name must be a string.'),

    body('age').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('Age must be a string.'),

    body('email').notEmpty().isString().isEmail().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Not a valid email address.'),

    body('phoneNumber', 'Phone number is required.').notEmpty().isString().isMobilePhone('en-NG')
    .escape().withMessage('Provide a valid phone number.'),

    body('address').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('Address must be a string.'),

    body('password', 'Password is required.').notEmpty().isString().isStrongPassword().escape()
    .withMessage('Password is not strong enough.'),

    body('membershipStatus', 'Member\'s membership status is required.').isString()
    .isIn([ 'registered', 'unregistered', 'relocated', 'excommunicated' ]).escape()
    .withMessage(`
        Member\'s membership status must be a string and have a value of 
        \'registered\', \'unregistered\', \'relocated\' or \'excommunicated\'.
    `),

    body('employmentStatus', 'Member\'s employment status is required.').isString()
    .isIn([ 'student', 'employed', 'unemployed' ]).escape()
    .withMessage(`
        Member\'s employment status must be a string and have a value of 
        \'student\', \'employed\' or \'unemployed\'.
    `),

    body('maritalStatus', 'Member\'s marital status is required.').isString()
    .isIn([ 'single', 'married', 'widow' ]).escape()
    .withMessage(`
        Member\'s marital status must be a string and have a value of 
        \'single\', \'married\', \'widow\''.
    `),

    body('maritalStatus').isString().isIn([
        'OKOTA_I', 'OKOTA_II', 'ISOLO_I', 'ISOLO_II', 'ISOLO_III', 'ISOLO_IV', 'MUSHIN', 'AJAO_ESTATE', 
        'EGBE_I', 'EGBE_II', 'IDIMU', 'OKE_AFA_I', 'OKE_AFA_II', 'OKE_AFA_III', 'OKE_AFA_IV', 'OKE_AFA_V', 
        'ABULE_IGBIRA', 'JAKANDE_I', 'JAKANDE_II', 'JAKANDE_III', 'JAKANDE_IV', 'BUCKNOR', 'EJIGBO_I', 
        'EJIGBO_II', 'EJIGBO_III', 'EJIGBO_IV', 'ISHERI_OSUN', 'IJEGUN_I', 'IJEGUN_II', 'ABARANJE'
    ]).escape().optional({nullable: true, checkFalsy: true})
    .withMessage("Member\'s marital status must be a string and have an accepted value."),

    body('dateOfBirth').isDate().notEmpty().isString().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Date of Birth must be a date.'),

    body('anniversary').isDate().notEmpty().isString().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Anniversary must be a date.')
]

// LoginMember route
export const loginMemberInputValidation = [
    body('phoneNumber', 'Phone number is required.').notEmpty().isString().isMobilePhone('en-NG')
    .escape().optional({nullable: true, checkFalsy: true})
    .custom((value, { req })=> {
        let status:boolean;
        if(!(req.body.email || value)) {
            status = false;
        } else {
            status = true;
        }
        return status;
    }).withMessage('Phone number or Email must be present.'),
    body('email', 'Must be an Email.').optional({nullable: true, checkFalsy: true}).isString()
    .isEmail().custom((value, { req })=> {
        let status:boolean;
        if(!(req.body.phoneNumber || value)) {
            status = false;
        } else {
            status = true;
        }
        return status;
    }).withMessage('Phone number or Email must be present.'),
    body('password', 'Password is required.').notEmpty().isString().escape()
    .withMessage('Password must be a string.'),
];

// updateMember route
export const updateMemberInputValidation = [
    body('profileImageUrl').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('profile image url must be a string.'),

    body('firstName').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('First name must be a string.'),

    body('middleName').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('Middle name must be a string.'),

    body('lastName').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('Last name must be a string.'),

    body('age').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('Age must be a string.'),

    body('email').notEmpty().isString().isEmail().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Not a valid email address.'),

    body('phoneNumber').notEmpty().isString().isMobilePhone('en-NG').escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Provide a valid phone number.'),

    body('address').notEmpty().isString().escape().optional({nullable: true, checkFalsy: true})
    .withMessage('Address must be a string.'),

    body('password', 'Password is required.').notEmpty().isString().isStrongPassword().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Password is not strong enough.'),

    body('membershipStatus').isString()
    .isIn([ 'registered', 'unregistered', 'relocated', 'excommunicated' ]).escape()
    .optional({nullable: true, checkFalsy: true}).withMessage(`
        Member\'s membership status must be a string and have a value of 
        \'registered\', \'unregistered\', \'relocated\' or \'excommunicated\'.
    `),

    body('employmentStatus').isString().isIn([ 'student', 'employed', 'unemployed' ]).escape()
    .optional({nullable: true, checkFalsy: true}).withMessage(`
        Member\'s employment status must be a string and have a value of 
        \'student\', \'employed\' or \'unemployed\'.
    `),

    body('maritalStatus').isString().isIn([ 'single', 'married', 'widow' ]).escape()
    .optional({nullable: true, checkFalsy: true}).withMessage(`
        Member\'s marital status must be a string and have a value of 
        \'single\', \'married\', \'widow\''.
    `),

    body('maritalStatus').isString().isIn([
        'OKOTA_I', 'OKOTA_II', 'ISOLO_I', 'ISOLO_II', 'ISOLO_III', 'ISOLO_IV', 'MUSHIN', 'AJAO_ESTATE', 
        'EGBE_I', 'EGBE_II', 'IDIMU', 'OKE_AFA_I', 'OKE_AFA_II', 'OKE_AFA_III', 'OKE_AFA_IV', 'OKE_AFA_V', 
        'ABULE_IGBIRA', 'JAKANDE_I', 'JAKANDE_II', 'JAKANDE_III', 'JAKANDE_IV', 'BUCKNOR', 'EJIGBO_I', 
        'EJIGBO_II', 'EJIGBO_III', 'EJIGBO_IV', 'ISHERI_OSUN', 'IJEGUN_I', 'IJEGUN_II', 'ABARANJE'
    ]).escape().optional({nullable: true, checkFalsy: true})
    .withMessage("Member\'s marital status must be a string and have an accepted value."),

    body('dateOfBirth').isDate().notEmpty().isString().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Date of Birth must be a date.'),

    body('anniversary').isDate().notEmpty().isString().escape()
    .optional({nullable: true, checkFalsy: true}).withMessage('Anniversary must be a date.')
]
