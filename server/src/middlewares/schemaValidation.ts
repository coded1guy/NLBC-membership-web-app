import { defineError } from "../utils/defineError";

// factory function middleware to validate data using schema provided
const schemaValidation = (scope, schema, property) => {
    return (req, res, next) => {
        const { error, value } = schema.validate(req[property]);
        let message:string, newError;
        if (error) {
            message = error.details.map(detail => detail.message).join(', ');
            newError = defineError(scope, "validation", null, message);
            newError.prop = property; 
            next(newError);
        } else {
            next();
        }
    }
}
export default schemaValidation;
