import express from 'express';
import mongoose from 'mongoose';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import path from 'path';
import methodOverride from 'method-override';
import jobRoutes from './Routes/jobRoute.js';
import authRoutes from './Routes/authRoute.js';
import session from 'express-session';
import passport from 'passport';
import localStrategy from 'passport-local';
import User from './Models/User.js';
import MongoStore from 'connect-mongo';
dotenv.config();

// Connecting the the MongoDB database.
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error: ", err));

// Starting up our express app.
const app = express();

// Setting up use of EJS.
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
console.log(path.join(__dirname, 'views'));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Setting up middleware.
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));

// Setting up express-session configuration.
const sessionSecret = process.env.SESSION_SECRET;
const sessionConfig = {
    secret: sessionSecret,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({
        mongoUrl: dbURI,
        collectionName: 'sessions'
    }),
    cookie: {
        httpOnly: true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7,
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}

// Set up session and passport.
app.use(session(sessionConfig));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Set up routes.
app.use('/jobs', jobRoutes);
app.use('/auth', authRoutes);

export default app;