// Seeds.js - Responsible for seeding database with Users and Jobs for testing.
import User from '../Models/User.js';
import Job from '../Models/Job.js';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

// Connecting to MongoDB to seed data.
dotenv.config();
const dbURI = process.env.MONGO_URI;
mongoose.connect(dbURI)
    .then(() => console.log("Connected to MongoDB"))
    .catch((err) => { console.log("Error: ", err) });

// Adds test users to the database.
const seedUsers = async () => {
    try {
        // An array of User Objects.
        const testUsers = [
            {
                _id: new mongoose.Types.ObjectId(),
                emailAddress: 'TestUser1@yahoo.com',
                password: 'TestUser1Password'
                
            },
            {
                _id: new mongoose.Types.ObjectId(),
                emailAddress: 'TestUser2@yahoo.com',
                password: 'TestUser2Password'
            },
            {
                _id: new mongoose.Types.ObjectId(),
                emailAddress: 'TestUser3@yahoo.com',
                password: 'TestUser3Password'
            }
        ]

        // Iterate through each User Object to see if it already exists in the database.
        // If it doesn't add it, if it does, console.log.
        for (const userData of testUsers) {
            // Find duplictae users based on unique email address.
            const foundUser = await User.findOne({ emailAddress: userData.emailAddress });

            // If no user with email address found, add the user to the db.
            if (!foundUser) {
                const newUser = new User(userData)
                await newUser.save();
                console.log(`Added new user: ${userData.emailAddress}`);
            } else {
                console.log(`ERROR: ${userData.emailAddress} already exists.`);
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

// Adds test jobs to the database.
const seedJobs = async () => {
    try {
        // An array of test Job Objects.
        const testJobs = [
            // User1 Jobs.
            {
                _id: new mongoose.Types.ObjectId(),
                company: 'Amazon',
                position: 'Junior SWE',
                location: 'San Francisco, CA',
                status: 'Applied',
                userId: new mongoose.Types.ObjectId('67f02ba8e024e20e6705746b')
            },
            {
                _id: new mongoose.Types.ObjectId(),
                company: 'Google',
                position: 'Entry Level SWE',
                location: 'Remote',
                status: 'Applied',
                userId: new mongoose.Types.ObjectId('67f02ba8e024e20e6705746b')
            },
            // User2Jobs.
            {
                _id: new mongoose.Types.ObjectId(),
                company: 'Barnes and Noble',
                position: 'Front Desk Clerk',
                location: 'Unknown',
                status: 'Rejected',
                userId: new mongoose.Types.ObjectId('67f02ba8e024e20e6705746c')
            }
        ]

        // Iterate through each Job Object to see if it already exists in the database.
        // If it doesn't add it, if it does, console.log.
        for (const jobData of testJobs) {
            const foundJob = await Job.findOne({
                company: jobData.company,
                position: jobData.position,
                userId: jobData.userId
            });

            // If no dulicate job, add job to db.
            if (!foundJob) {
                const newJob = new Job(jobData)
                await newJob.save();
                console.log(`Added new job: ${jobData.company}`);
            } else {
                console.log(`ERROR: ${jobData.position} at ${jobData.company} already exists.`);
            }
        }
    } catch (error) {
        console.log("Error: ", error);
    }
}

// Function to seed users and jobs.
const seedDatabase = async () => {
    await seedUsers();
    await seedJobs();
    mongoose.disconnect();
}

// Delete Previous MongoDB data
await Job.deleteMany({});

// Seeding here.
seedDatabase();