import http from 'http' ;
import cors from 'cors' ;
import express from 'express' ;
import authRouter from './routes/AuthRoutes.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv'
import cookieParser from 'cookie-parser';
import apiRouter from './routes/ApiResponseRoutes.js';
import historyRouter from './routes/historyRoutes.js';

dotenv.config()
const app = express() ;
const PORT = 3000 ;
const server = http.createServer(app) ;



app.use(cors({
    origin: "http://localhost:5173",
    credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true })); 
app.use(cookieParser());

app.use('/auth' , authRouter) ;
app.use('/api' , apiRouter) ;
app.use('/history' , historyRouter );


server.listen(PORT , () => {
    console.log(`Server running at ${PORT}`);
})



mongoose.connect(process.env.MONGO_URI)
.then(() => console.log("Connected to DB"))
.catch((e) => console.log("Failed to connnect to DB"))
