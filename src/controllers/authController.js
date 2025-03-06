import { addTokenToBlackList } from '../middlware/chekTokenBlackList.js';
import User from '../models/userModel.js';
import { comparePassword, compareRefreshToken, hashPassword, hashRefreshToken } from '../utils/authUtil.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtil.js';
import { generateAccessToken, generateRefreshToken } from '../utils/tokenUtil.js';
import { userLoginValidation, userRegistrationValidation } from '../validations/authValidation.js';
import jwt from "jsonwebtoken";

export const registerUser = async (req, res) => {
    try {

        const { userRole, name, email, password, contactNumber } = req.body;

        const validationErrors = userRegistrationValidation(req.body);

        if (Object.keys(validationErrors).length > 0) {
            return sendErrorResponse(res, 400, "User validation errors", validationErrors);
        }

        const userExists = await User.findOne({ email: email });

        if (userExists) {
            return sendErrorResponse(res, 400, "User already exists");
        }

        const hashedPassword = await hashPassword(password);

        const user = await User.create({
            userRole: userRole,
            name: name,
            email: email,
            password: hashedPassword,
            contactNumber: contactNumber
        })

        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        const hashedRefreshToken = await hashRefreshToken(refreshToken);

        user.refreshToken = hashedRefreshToken;

        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return sendSuccessResponse(res, 201, "User registered successfully", {
            accessToken,
        });


    } catch (error) {

        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
};

export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        const validationErrors = userLoginValidation(req.body);

        if (Object.keys(validationErrors).length > 0) {
            return sendErrorResponse(res, 400, "User validation errors", validationErrors);
        }

        const user = await User.findOne({
            email: email
        });

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
            return sendErrorResponse(res, 400, "Invalid username or password");
        }

        const accessToken = generateAccessToken(user._id);

        const refreshToken = generateRefreshToken(user._id);

        const hashedRefreshToken = await hashRefreshToken(refreshToken);

        user.refreshToken = hashedRefreshToken;

        await user.save();

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return sendSuccessResponse(res, 201, "User loged in successfully", {
            accessToken,
        });


    } catch (error) {

        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
}

export const logoutUser = async (req, res) => {
    try {

         const {userId} = req.user;
        
         const user = await User.findOne({_id:userId});

         if(!user){
            return sendErrorResponse(res,404,"User not found");
         }

         const token = req.headers.authorization?.split(" ")[1];

         addTokenToBlackList(token);

         user.refreshToken = null;

         await user.save();

         res.clearCookie("refreshToken");

         return sendSuccessResponse(res, 200, "Logout successful");

    } catch (error) {

        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
}

export const setRefreshToken = async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return sendErrorResponse(res, 400, "Refresh token is required");
        }

        let decodedRefreshToken
        try {

            decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
           
        } catch (error) {

            if (error instanceof jwt.TokenExpiredError) {
                return sendErrorResponse(res, 401, "Access Token expired.", error);
            }

            if (error instanceof jwt.JsonWebTokenError) {
                return sendErrorResponse(res, 401, "Invalid token.", error);
            }

            return sendErrorResponse(res, 500, "Internal Server Error", error);
        }

        const user = await User.findOne({ _id: decodedRefreshToken.userId });
        
        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        const isMatch = await compareRefreshToken(refreshToken, user.refreshToken);

        if (!isMatch) {
            return sendErrorResponse(res, 400, "Invalid refresh token");
        }

        const accessToken = generateAccessToken(user._id);
       
        const newRefreshToken = generateRefreshToken(user._id);
       
        const hashedRefreshToken = await hashRefreshToken(newRefreshToken);

        user.refreshToken = hashedRefreshToken;

        await user.save();

        res.cookie("refreshToken", newRefreshToken, {
            httpOnly: true,
            secure: true,
            sameSite: "Strict",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        return sendSuccessResponse(res, 200, "Tokens refreshed successfully", {
            accessToken,
        });

    } catch (error) {
        
        sendErrorResponse(res, 500, "Internal Server Error", error);
    }
}