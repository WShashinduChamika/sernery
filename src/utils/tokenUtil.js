import jwt from 'jsonwebtoken';

export const generateAccessToken = (userId) => {
    return jwt.sign({ userId }, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "1h" });
}

export const generateRefreshToken = (userId) => {
    return jwt.sign({ userId }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: "7 days" });
}

export const generateResetPasswordToken = (userId) => {
    return jwt.sign({ userId }, process.env.RESET_PASSWORD_TOKEN_SECRET);
}

export const verifyEncodedToken = (token, secret) => {
    
    try {

       const decodedToken = jwt.verify(token, secret);
       return decodedToken;

    } catch (error) {

        if (error instanceof jwt.TokenExpiredError) {
            return sendErrorResponse(res, 401, "Access Token expired.", error);
        }

        if (error instanceof jwt.JsonWebTokenError) {
            return sendErrorResponse(res, 401, "Invalid token.", error);
        }

        return sendErrorResponse(res, 500, "Internal Server Error", error);
    }
}