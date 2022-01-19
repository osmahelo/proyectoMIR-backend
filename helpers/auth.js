const jwt = require('jsonwebtoken')
const { BadRequestError } = require('../errors');

const auth = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    if( !authorization ) {
      throw BadRequestError('Your session has expired!')
    }
    const [ bearer , token ] = authorization.split(' ');
    if( !token ) {
      throw BadRequestError('Your session has expired!')
    }
    const { id } = jwt.verify( token , 'JWTSECRET' );
    req.user = id      
    next();
  }
    catch (err) {
    throw BadRequestError('Your session has expired!') 
  }
}

module.exports = auth;