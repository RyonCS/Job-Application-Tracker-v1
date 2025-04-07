import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js'
import dotenv from 'dotenv';
dotenv.config();

const secretToken = process.env.JWT_SECRET_KEY;

export const getLoginPage = (req, res) => {
    res.render('login');
}

export const getRegisterPage = (req, res) => {
    res.render('register');
}

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user) {
            const validPassword = await bcrypt.compare(password, user.password);
            if (validPassword) {
                res.send("Welcome")
            } else {
                res.send("NOPE")
            }
        } else {
            res.send("Wrong Username or Password");
        }
        
    } catch (err) {
        console.log(err);
    }
}

export const register = async (req, res) => {
    const { emailAddress, password } = req.body;
    try {
        console.log(`Email and Password`, req.body);
        const foundUser = await User.findOne({ emailAddress });
        console.log("FoundUser", foundUser);
        if (foundUser) return res.status(400).send(`User already exists with email: ${emailAddress}`);

        // Hash new user password.
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ emailAddress, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, secretToken, { expiresIn: '1h' });
        res.status(201).json({ token });
    } catch (err) {
        console.error(err);
        res.status(500).send("500: Server Error.");
    }
}