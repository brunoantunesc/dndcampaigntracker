const jwt = require('jsonwebtoken');

const secret = 'testesecreto123';

const token = jwt.sign({ user: 'teste' }, secret, { expiresIn: 60 });
console.log('Token:', token);

const decoded = jwt.decode(token);
console.log('Decoded iat:', decoded.iat);
console.log('Decoded exp:', decoded.exp);
console.log('Expires in seconds:', decoded.exp - decoded.iat);
