import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/dbConnection.js";
import authRouter from "./routes/authRouter.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

await connectDB();

const allowedOrigins = ["https://mern-auth-client-orpin.vercel.app"];

app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));
app.get("/", (req, res) => res.send("API is working fine"));
app.use("/api/auth", authRouter);

app.listen(PORT, () => console.log(`Server is running port: ${PORT}`));
