import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import methodOverride from 'method-override';
import jobRoutes from './Routes/jobRoute.js';
import authRoutes from './Routes/authRoute.js';
import passport from 'passport';
import localStrategy from 'passport-local';


// Connecting the the MongDB database.
dotenv.config();
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error: ", err));

// Starting up our express app.
const app = express();

// Setting up use of EJS.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setting up middleware.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
// app.use(session(sessionConfig));
// app.use(passport.initialize());
// app.use(passport.session());

app.use('/', jobRoutes);
app.use('/', authRoutes);

app.get('/', (req, res) => {
    res.redirect('/login');
})

export default app;