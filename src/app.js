import "express-async-errors"
import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors"

const app = express()

//middlwares
app.use(cors({
    origin: CORS_ORIGIN,
    methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE'],
    credentials: true,
}));
app.use(express.json({limit: "16kb"}))
app.use(cookieParser())


// routes import
import userRouter from "./routes/user.routes.js";
import feedRouter from "./routes/feed.routes.js";
import taskRouter from "./routes/task.routes.js";
import errorHandeler from "./middlewares/errorHandeller.middleware.js"


// routes declaration
app.use("/api/v1/user", userRouter)

app.use("/api/v1/feed", feedRouter)

app.use("/api/v1/task", taskRouter)

app.get('/', async(_, res)=>{
    return res
    .status(200)
    .json({message : 'hello'});
})


//error handeller
app.use(errorHandeler)


export { app }