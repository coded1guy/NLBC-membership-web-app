const provideInput = (req, res, next) => {
    const body:object = req.body;
    // checks if the object or its attribute is empty
    if(
        (Object.keys(body).length === 0) && (body.constructor === Object) || 
        (Object.values(body).every(x => x === null || x === ''))
    ) {
        res.status(400).json({ message: "please provide an input!" });
        return;
    } else next();
}
export default provideInput;
