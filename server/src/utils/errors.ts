const errorHandler = (err, req, res, next) => {
    console.error(err);
    switch (err.type) {
        case "noInput":
            res.status(400).json({ message: 'No input provided.' });
            break;
        case "badInput":
            res.status(400).json({ message: 'Bad input provided.' });
            break;
        case "password":
            res.status(401).json({ message: "Password is not correct. Try again." });
            break;
        case "forbidden":
            res.status(403).json({ message: `${err.scope} is not allowed to access this resource.` });
            break;
        case "notExist":
            res.status(404).json({ message: `${err.scope} does not exist.` });
            break;
        case "create":
            res.status(404).json({ message: `Couldn't create ${err.scope}.` });
            break;
        case "update":
            res.status(404).json({ message: `Couldn't update ${err.scope}.` });
            break;
        case "delete":
            res.status(404).json({ message: `Couldn't delete ${err.scope}.` });
        case "server":
            res.status(500).json({ message: "Internal error, check back later." });
        default:
            res.status(404).json({ message: err.message });
    }
}
export default errorHandler;
