import multer from 'multer';
import upload from '../configs/multer';
import { defineError } from '../utils/defineError';

export const uploadSingleFile = (fileName:string, scope:string) => {
    return (req, res, next) => {
        // function that calls the defineError function and pass the error to the error handler
        const sendError = (err:object | null, type:string="multer") => {
            const error = defineError(scope, type, err);
            next(error);
        }
        upload.single(fileName)(req, res, function (err) {
            if (err instanceof multer.MulterError) {
                // A Multer error occurred when uploading.
                sendError(err);
                return;
            } else if (err) {
                // An unknown error occurred.
                sendError(err, "server");
                return;
            }
            // No error occurred, continue to the next middleware.
            next();
        });
    };
}