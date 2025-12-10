import jwt from 'jsonwebtoken';
import {Users} from '../model/user.js';

export const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization').replace('Bearer ', '');
        const decoded = jwt.verify(token, 'secretkey');
        const user = await Users.findOne({ _id: decoded._id, 'tokens.token': token });  
        if (!user) {
            throw new Error();
        }
        req.token = token;
        req.user = user;
        next();
    } catch (e) {
        res.status(401).send({ error: 'Please authenticate.' });
    }       
};