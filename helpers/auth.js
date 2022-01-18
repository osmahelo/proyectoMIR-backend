const { BadRequestError } = require('../errors');

const helpers={};
helpers.isAuthenticated =(req,res,next)=>{
    if (req.isAuthenticated()){
        return next()
    }
    res.redirect('/sessionlogin')
    throw new BadRequestError('Not authorized')
};

module.exports= helpers