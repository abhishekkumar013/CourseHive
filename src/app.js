import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

const app = express();

app.use(
    cors({
      origin: ['http://localhost:5173'],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      credentials: true,
    }),
)

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('public'))
app.use(cookieParser())

import userRoutes from './routes/user.routes.js'
import categoryRoutes from './routes/category.routes.js'

app.use('/api/v1/users',userRoutes)
app.use('/api/v1/category',categoryRoutes)

export {app}