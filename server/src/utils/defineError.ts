// this define the error before it is passed to the error handler
export const defineError = (scope:string, type:string, error:object | null, message:string ="") => {
    if(error === null) {
        error = new Error(`${type} error occured.`);
    }
    // adds cuustom message to the user if they added it
    if(message) { error["message"] = message };
    // adds the error scope and type
    error["scope"] = scope;
    error["type"] = type;
    // returns the new/updated error object
    return error;
}

// define catch block error type
export const defineCatchType = (e, otherType) => {
    let type:string;
    if(e.hasOwnProperty('errorCode') && (e.errorCode === undefined)) {
        type = "Network"
    } else type = otherType;
    return type;
}
