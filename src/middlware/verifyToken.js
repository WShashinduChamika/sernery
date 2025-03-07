import jwt from "jsonwebtoken";
import { sendErrorResponse } from "../utils/responseUtil.js";
import { verifyEncodedToken } from "../utils/tokenUtil.js";

export const verifyToken = (req, res, next) => {

    const token = req.headers.authorization?.split(" ")[1]; // Format: "Bearer <token>"

    if (!token) {
        return sendErrorResponse(res, 401, "Access denied. No token provided")
    }

    const decodedToken = verifyEncodedToken(token, process.env.ACCESS_TOKEN_SECRET);

    req.user = decodedToken;

    next();
}