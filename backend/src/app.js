import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

app.use(express.json({
    limit: "16kb"
}))

app.use(express.urlencoded({
    extended: true,
    limit: "16kb"
}))

app.use(express.static("public"))

app.use(cookieParser())

// import routes
import userRouter from './routes/user.routes.js';
import artistRouter from './routes/artist.routes.js';
import followersRouter from './routes/followers.routes.js';
// declare routes
app.use("/api/users", userRouter)
app.use("/api/artists", artistRouter)
app.use("/api/followers", followersRouter)
export { app }