import Job from '../Models/Job.js'
import mongoose from 'mongoose';

// Get and display all of the user's jobs.
export const getAllJobs = async (req, res) => {
    // Get the current session ID - userID.
    const loggedInUserID = req.session.user_id;
    // If session ID isnt found, redirect to login.
    if (!loggedInUserID) {
        return res.redirect('/auth/login');
    }

    let sort = req.query.sort || 'dateAsc';
    let filter = req.query.filter || '';

    let sortOption = {};
    switch (sort) {
        case 'dateAsc':
            sortOption = { date: 1 };
            break;
        case 'dateDesc':
            sortOption = { date: -1 };
            break;
        case 'locationAsc':
            sortOption = { location: -1 };
            break;
        case 'locationDesc':
            sortOption = { location: -1 };
            break;
        default:
            sortOption = { date: 1 };
    }
    console.log(sortOption)
    console.log(filter);

    const query = { userId: loggedInUserID };
    if (filter === 'excludeRejected') {
        query.status = { $ne: 'Rejected' }; 
    }

    const userJobs = await Job.find(query).sort(sortOption);
    res.render('myJobs', { userJobs, sort, filter });
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

    res.redirect('/jobs/myJobs');
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
    res.redirect('/jobs/myJobs');
}

// Delete a job.
export const deleteJob = async (req, res) => {
    // Get the id for the job and delete it.
    const { _id } = req.params;
    await Job.findByIdAndDelete(_id);
    res.redirect('/jobs/myJobs');
}