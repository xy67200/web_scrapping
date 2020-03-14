module.exports = {
    signup(req, res, next) {
            req.checkBody("email", "Email is required").trim().notEmpty();
            req.checkBody("email", "Email is not valid").trim().isEmail();
            req.checkBody("name", "Name is required").trim().notEmpty();
            req.checkBody("phone", "Phone No is required").trim().notEmpty();
            req.checkBody("password", "Password is required").trim().notEmpty();
            req.checkBody("location", "Location is required").trim().notEmpty();
      
        req.asyncValidationErrors()
            .then(() => {
                next();
            })
            .catch(errors => res.json({
                success: false,
                errors: errors[0].msg,
            }));
    },
}