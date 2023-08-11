const errorHandler = (err, req, res, next) => {
    console.log("error");
    console.log(err);
    switch (err.type) {
        case "create":
            res.status(404).json({ message: `Couldn't create ${err.scope}.` });
            break;
        case "login":
            console.log("no login");
            res.status(400).json({ message: `Didn\'t find any admin with the ${err.loginType} provided.` });
            break;
        case "get":
            res.status(400).json({ message: `There is no ${err.scope} with the detail provided.`, error: err });
            break;
        case "noList":
            res.status(400).json({ message: `There is no more list of ${err.scope}s in the database.`, error: err });
            break;
        case "badInput":
            res.status(400).json({ message: 'Bad input provided.' });
            break;
        case "password":
            res.status(401).json({ message: "Password provided is not correct. Try again." });
            break;
        case "forbidden":
            res.status(403).json({ message: `${err.scope} is not allowed to access this resource.` });
            break;
        case "id":
            res.status(404).json({ message: `${err.scope} with id provided does not exist.` });
            break;
        case "update":
            res.status(404).json({ message: `Couldn't update ${err.scope}.` });
            break;
        case "delete":
            res.status(404).json({ message: `Couldn't delete ${err.scope}.` });
        case "Network":
            res.status(500).json({ message: "Check your connections and try again." });
        case "server":
            res.status(500).json({ message: "Internal error, check back later." });
        default:
            res.status(404).json({ message: err.message, error: err });
    }
}
export default errorHandler;
