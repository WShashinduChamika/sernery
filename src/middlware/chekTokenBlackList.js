import jwt from 'jsonwebtoken';
import BlackListToken from '../models/blackListTokenModel.js';
import { sendErrorResponse } from '../utils/responseUtil.js';

export const checkTokenBlackList = async (req, res, next) => {

    try {

        const token = req.headers.authorization?.split(" ")[1]; // Format "Bearer <token>"	

        if (!token) {
            return next();
        }

        const isBlackListToken = await BlackListToken.findOne({token}).lean();

        if(isBlackListToken){
            return sendErrorResponse(res, 401, "Token is blacklisted");
        }

        next();

    } catch (error) {
       
        return sendErrorResponse(res,500,"Internal Server Error",error)
    }
}



export const addTokenToBlackList = async (token) => {

    try {

        const decodedToken = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

        const expiredAt = new Date(decodedToken.exp * 1000);

        const isBlackListToken = await BlackListToken.findOne({ token });

        if (isBlackListToken) {
            return;
        }

        await BlackListToken.create({ token, expiredAt });

    } catch (error) {

        return console.log("Inernet Server Error", error);
    }


}