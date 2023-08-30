import { Prisma } from "@prisma/client";
import prisma from "../../db";
import uploadProfileImage from "../../utils/uploads/profileImage";
import { defineError, defineCatchType } from "../../utils/defineError";
import { memberScope } from ".";

// Handler for member to update themselve
const updateMember = async (req, res, next) => {
    // declaring and initializing variables
    const { id } = req.params;
    let requestBody:object = {};
    let member:object | null, where:Prisma.MemberWhereUniqueInput;
    let profileImageUrl;

    // simple function for error handling while querying the db
    const sendError = function (type, error) {
        error = defineError(memberScope, type, error);
        next(error);
    }
    
    // destructuring required input values from the req.body
    const { 
        firstName, middleName, lastName, age, 
        email, phoneNumber, address, password, membershipStatus, 
        employmentStatus, maritalStatus, dateOfBirth, anniversary 
    } = req.body;

    // If req.file is present, handle the upload to cloudinary
    if(req.file) {
        try {
            profileImageUrl = await uploadProfileImage(req.file.buffer, `${firstName}-${lastName}-profile-image`);
            if(!profileImageUrl) {
                throw new Error("Didn't get the profile Image url.");
            }
        } catch(e) {
            return sendError("imageUpload", e);
        }
    }

    // checking through the allowed inputs
    if(profileImageUrl) requestBody["profileImageUrl"] = profileImageUrl;
    if(firstName) requestBody["firstName"] = firstName;
    if(middleName) requestBody["middleName"] = middleName;
    if(lastName) requestBody["lastName"] = lastName;
    if(age) requestBody["age"] = age;
    if(email) requestBody["email"] = email;
    if(phoneNumber) requestBody["phoneNumber"] = phoneNumber;
    if(address) requestBody["address"] = address;
    if(employmentStatus) requestBody["employmentStatus"] = employmentStatus;
    if(maritalStatus) requestBody["maritalStatus"] = maritalStatus;
    if(dateOfBirth) requestBody["dateOfBirth"] = dateOfBirth;
    if(anniversary) requestBody["anniversary"] = anniversary;

    // defining the where object
    if(!id) {
        where = { id: req.user.id };
    } else if(id) {
        where = { id };
        if(membershipStatus) requestBody["membershipStatus"] = membershipStatus;
    }

    // making an update query
    try {
        member = await prisma.member.update({
            where,
            data: requestBody
        })
    } catch(e) {
        return sendError(defineCatchType(e, "update"), e);
    }

    // checking if there is a need for the user to re-login
    let login:boolean, extraUpdateMsg:string = "";
    if(password || email || phoneNumber) {
        extraUpdateMsg = " Login required!";
        login: true;
    } else {
        login: false;
    }
    return res.status(200).json({ message: `Updated member successfully.${extraUpdateMsg}`, login, member: member });
}

export default updateMember;
