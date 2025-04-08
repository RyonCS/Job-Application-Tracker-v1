import Job from '../Models/Job.js'
import mongoose from 'mongoose';

// Get and display all of the user's jobs.
export const getAllJobs = async (req, res) => {
    // Get the current session ID - userID.
    const loggedInUserID = req.session.user_id;
    // If session ID isnt found, redirect to login.
    if (!loggedInUserID) {
        return res.redirect('/login');
    }
    // If sessionID is found, get all user jobs and display.
    const userJobs = await Job.find({ userId: req.session.user_id });
    res.render('myJobs', { userJobs })
    
}

// Display the new Job Page.
export const newJobPage = (req, res) => {
    res.render('newJob');
}

// Add a new job.
export const addNewJob = async (req, res) => {
    // Create job and get userId from session.
    const newJobId = new mongoose.Types.ObjectId()
    const loggedInUserID = req.session.user_id;
    const loggedInUserIDObject = new mongoose.Types.ObjectId(loggedInUserID);

    // Create a new job.
    const newJobData = {
        ...req.body,
        userId: loggedInUserIDObject
    };
    const newJob = new Job(newJobData);
    await newJob.save();

    res.redirect('/myJobs');
}

// Display edit job page.
export const editJobPage = async (req, res) => {
    const { _id } = req.params;
    const job = await Job.findById(_id);
    res.render('edit', ({ job }));
}

// Edit a job.
export const editJob = async (req, res) => {
    // Get the id for the job and update it.
    const { _id } = req.params;
    const newJob = await Job.findByIdAndUpdate(_id, req.body, { runValidators: true });
    res.redirect('/myJobs');
}

// Delete a job.
export const deleteJob = async (req, res) => {
        // Get the id for the job and delete it.
    const { _id } = req.params;
    await Job.findByIdAndDelete(_id);
    res.redirect('/myJobs');
}