import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import User from '../Models/User.js'

export const login = async (req, res) => {
    const { email, password } = req.body;

}

export const register = async (req, res) => {
    const { email, password } = req.body;
    try {
        const foundUser = User.findOne({ email });
        if (foundUser) return res.status(400).send(`User already exists with email: ${email}`);

        // Hash new user password.
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = new User({ emailAddress: email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id, })
    }
    }
    
}