const provideInput = (req, res, next) => {
    if((Object.keys(req.body).length === 0) && (req.body.constructor === Object)) {
        res.status(400).json({ message: "please provide an input!" });
        return;
    } else next();
}
export default provideInput;
