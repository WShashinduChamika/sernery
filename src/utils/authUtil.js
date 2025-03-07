import bcrypt from 'bcrypt';
import axios from 'axios';

const saltRound = parseInt(process.env.SALT_ROUND) || 10; // Default to 10 if not set

export const hashPassword = async (password) => {
    return await bcrypt.hash(password, saltRound );
}

export const comparePassword = async (password, hashedPassword) => {
    return await bcrypt.compare(password,hashedPassword);
}

export const hashRefreshToken = async (refreshToken) =>{
    return await bcrypt.hash(refreshToken, saltRound);
}

export const compareRefreshToken = async (refreshToken, hashedRefreshToken) =>{
    return await bcrypt.compare(refreshToken, hashedRefreshToken);
}

export const sendResetEmail = async (userEmail, accessToken)=> {
    try {

        const resetLink = `https://yourdomain.com/reset-password?token=${accessToken}`;
        console.log(userEmail);
        const response = await axios.post("https://formcarry.com/s/xXJnoqUpH4V", {
            email: userEmail, // Email recipient
            subject: "Password Reset Request",
            message: `Click the link below to reset your password: \n\n ${resetLink}`
        });

        return response.data;

    } catch (error) {

        console.error("Error sending email:", error.response ? error.response.data : error.message);
        throw error;
    }
}