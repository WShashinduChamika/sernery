import dotenv from "dotenv";
dotenv.config();

export const corsOptions = {
    origin: [process.env.BASE_DEV_URL,process.env.BASE_LOCAL_URL], 
    credentials: true, // Allow cookies & authentication headers
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"], // Allowed methods
    allowedHeaders: ["Content-Type", "Authorization"], // Allowed headers
}