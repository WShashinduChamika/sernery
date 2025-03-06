import express from "express";
import cors from "cors";
import {corsOptions} from "./src/config/cors_config.js";
import dotenv from "dotenv";
dotenv.config();
import bodyParser from "body-parser";
import {connectDB} from "./src/config/db_connection.js";
import {authRoutes} from "./src/routes/authRoutes.js";

const app = express();
const PORT = process.env.PORT || 3000;

//Middleware
app.use(cors(corsOptions));
app.use(bodyParser.json());
app.use(express.json());

//connect to MongoDB
connectDB();

//Routes
app.use("/api/v1/auth", authRoutes);

//Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});