import Job from '../Models/Job.js'
import mongoose from 'mongoose';

// Get and display all of the user's jobs.
export const getAllJobs = async (req, res) => {
    const user1ID = '67f02ba8e024e20e6705746b'
    const user1IDObject = new mongoose.Types.ObjectId(user1ID)

    const user1jobs = await Job.find({ userId: user1IDObject });

    res.render('myJobs', { user1jobs })
}

// Display the new Job Page.
export const newJobPage = (req, res) => {
    res.render('newJob');
}

export const addNewJob = async (req, res) => {
    console.log(req.body);
    const currentDate = Date.now();
    const user1ID = '67f02ba8e024e20e6705746b'
    const user1IDObject = new mongoose.Types.ObjectId(user1ID)
    const newJobId = new mongoose.Types.ObjectId()

    const newJobData = {
        _id: newJobId,
        ...req.body,
        date: currentDate,
        userId: user1IDObject
    };

    const newJob = new Job(newJobData);
    await newJob.save();

    const user1jobs = await Job.find({ userId: user1IDObject });

    res.redirect('/myJobs');
}

export const editJobPage = async (req, res) => {
    const { _id } = req.params;
    const job = await Job.findById(_id);
    res.render('edit', ({ job }));
}

export const editJob = async (req, res) => {
    const { _id } = req.params;
    const newJob = await Job.findByIdAndUpdate(_id, req.body, { runValidators: true });
    res.redirect('/myJobs');
}

export const deleteJob = async (req, res) => {
    const { _id } = req.params;
    await Job.findByIdAndDelete(_id);
    res.redirect('/myJobs');
}