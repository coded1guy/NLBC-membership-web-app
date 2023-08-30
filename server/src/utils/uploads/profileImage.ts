import cloudinary from "../../configs/cloudinary";

async function uploadProfileImage(imageBuffer, profileName) {
    return new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream(
            { 
                resource_type: 'image', 
                folder: 'profile_images',
                public_id: profileName 
            }, 
            (error, result) => {
            if (error) {
                reject(error);
            } else {
                resolve(result.secure_url);
            }
        }).end(imageBuffer);
    });
}

export default uploadProfileImage;
