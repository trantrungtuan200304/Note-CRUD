import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import bodyParser from 'body-parser';
import noteRoutes from './routes/noteRoutes.js';

const app = express();
dotenv.config();

app.use(cors());
app.use(bodyParser.json());
app.use(express.json());

const PORT = process.env.PORT || 5000;
const MONGOURL = process.env.MONGO_URL;

app.use('/api/notes', noteRoutes);

mongoose.connect(MONGOURL).then(() => {
    console.log("Database is connected");
    app.listen(PORT, (req, res) => {
        console.log(`Server is running on ${PORT}`);
    })
}).catch((err) => console.log(err))