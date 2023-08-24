import Joi from "joi";
import { isPasswordValid } from "./";

// member enum arrays
const MembershipStatus = [ 'registered', 'unregistered', 'relocated', 'excommunicated' ];
const EmploymentStatus = [ 'student', 'employed', 'unemployed' ];
const MaritalStatus = [ 'single', 'married', 'widow' ];
const HomeFellowship = [
    'OKOTA_I',
    'OKOTA_II',
    'ISOLO_I',
    'ISOLO_II',
    'ISOLO_III',
    'ISOLO_IV',
    'MUSHIN',
    'AJAO_ESTATE',
    'EGBE_I',
    'EGBE_II',
    'IDIMU',
    'OKE_AFA_I',
    'OKE_AFA_II',
    'OKE_AFA_III',
    'OKE_AFA_IV',
    'OKE_AFA_V',
    'ABULE_IGBIRA',
    'JAKANDE_I',
    'JAKANDE_II',
    'JAKANDE_III',
    'JAKANDE_IV',
    'BUCKNOR',
    'EJIGBO_I',
    'EJIGBO_II',
    'EJIGBO_III',
    'EJIGBO_IV',
    'ISHERI_OSUN',
    'IJEGUN_I',
    'IJEGUN_II',
    'ABARANJE'
];

// default validation options
const profileImageUrl = Joi.string().optional(),
    firstName = Joi.string(),
    middleName = Joi.string().optional(),
    lastName = Joi.string(),
    age = Joi.number().optional(),
    email = Joi.string().email().optional(),
    phoneNumber = Joi.string().pattern(/^\d{8,15}$/).optional().messages({
        'string.pattern.base': 'Phone number must be 8 - 15 digits long.'
    }),
    address = Joi.string().optional(),
    password = Joi.string().custom(isPasswordValid).required(),
    membershipStatus = Joi.string().valid(...MembershipStatus).optional(),
    employmentStatus = Joi.string().valid(...EmploymentStatus).optional(),
    maritalStatus = Joi.string().valid(...MaritalStatus).optional(),
    homeFellowship = Joi.string().valid(...HomeFellowship).optional(),
    dateOfBirth = Joi.date().max('now').optional(),
    anniversary = Joi.date().max('now').optional()
;
const messages = {
    'password.invalid': 'Password must be at least 6 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character',
};

// SCHEMA's
// create Schema
export const createMemberSchema  = Joi.object({
    profileImageUrl, 
    firstName: firstName.required(), 
    middleName, 
    lastName: lastName.required(), 
    age, 
    email, 
    phoneNumber, 
    address, 
    password, 
    membershipStatus,
    employmentStatus,
    maritalStatus,
    homeFellowship,
    dateOfBirth,
    anniversary
}).or('email', 'phoneNumber').messages(messages);

// login schema
export const loginMemberSchema  = Joi.object({
    email,
    phoneNumber,
    password,
}).or('email', 'phoneNumber').messages(messages);

// update schema
export const updateMemberSchema  = Joi.object({
    profileImageUrl, 
    firstName: firstName.optional(), 
    middleName, 
    lastName: lastName.optional(), 
    age, 
    email, 
    phoneNumber, 
    address, 
    membershipStatus, 
    employmentStatus, 
    maritalStatus, 
    homeFellowship, 
    dateOfBirth, 
    anniversary 
});
