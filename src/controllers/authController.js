import { addTokenToBlackList } from '../middlware/chekTokenBlackList.js';
import User from '../models/userModel.js';
import { comparePassword, compareRefreshToken, hashPassword, hashRefreshToken, sendResetEmail } from '../utils/authUtil.js';
import { sendSuccessResponse, sendErrorResponse } from '../utils/responseUtil.js';
import { generateAccessToken, generateRefreshToken, generateResetPasswordToken, verifyEncodedToken } from '../utils/tokenUtil.js';
import { forgotPasswordValidation, resetPasswordValidation, userLoginValidation, userRegistrationValidation } from '../validations/authValidation.js';

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

        const { userId } = req.user;

        const user = await User.findOne({ _id: userId });

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
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
        
        const decodedRefreshToken = verifyEncodedToken(refreshToken,process.env.REFRESH_TOKEN_SECRET);

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

export const forgotPassword = async (req, res) => {
    try {

        const { email } = req.body;
        
        console.log(email);

        const validationError = forgotPasswordValidation(email);

        if (Object.keys(validationError).length > 0) {
            return sendErrorResponse(res, 400, "Email validation errors", validationError);
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return sendErrorResponse(res, 404, "User not found");
        }

        //Send email with password reset link
        const resetPasswordToken = generateResetPasswordToken(user._id);

        const data = await sendResetEmail(user.email, resetPasswordToken);

        if (data) {
            return sendSuccessResponse(res, 200, "Password reset link sent successfully", data);
        }

    } catch (error) {

        sendErrorResponse(res, 500, "Internal Server Error", error);

    }
}

export const resetPasswrod = async (req, res) => {

    const { password, token } = req.body;

    const validationError = resetPasswordValidation(password);

    if(validationError){
        return sendErrorResponse(res, 400, "Password validation errors",validationError);
    }

    if (!token) {
        return sendErrorResponse(res, 401, "Access denied. No token provided");
    }

    const decodedResetPasswordToken = verifyEncodedToken(token,process.env.RESET_PASSWORD_TOKEN_SECRET);

    const userId = decodedResetPasswordToken.userId;

    const user = await User.findOne({ _id: userId });

    if (!user) {
        return sendErrorResponse(res, 404, "User not found");
    }

    const hashedPassword = await hashPassword(password);
    
    user.password = hashedPassword;

    await user.save();

    return sendSuccessResponse(res, 200, "Password successfully updated !");

}