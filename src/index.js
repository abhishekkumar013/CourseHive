import { app } from "./app.js";
import dotenv from 'dotenv'
import connectDb from "./config/dbConnect.js";
import { errorMiddleware } from "./utils/ErrorHandler.js";

dotenv.config(
    {
        path: './.env',
    }
)

connectDb()
    .then(() => {
        app.listen(process.env.PORT || 4040, () => {
        console.log(`Server start at port ${process.env.PORT}`)
        })
    })
    .catch((err) => {
        console.log('MONGO ERROR', err)
    })

app.use(errorMiddleware)