import bcrypt from 'bcrypt';

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
