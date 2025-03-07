import express from "express";
import { loginUser, logoutUser, registerUser, setRefreshToken } from "../controllers/authController.js";
import { verifyToken } from "../middlware/verifyToken.js";
import { checkTokenBlackList } from "../middlware/chekTokenBlackList.js";

const router = express.Router();

router.post("/register", registerUser);

router.post("/login", loginUser);

router.post("/logout", verifyToken, checkTokenBlackList, logoutUser);

router.post("/set-refresh-token", setRefreshToken);

router.get("/test",verifyToken,(req,res)=>{
    res.send({message:"success"});
});

export {router as authRoutes};