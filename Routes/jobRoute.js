import app from '../app.js';
import express from 'express';
import mongoose from 'mongoose';
import Job from '../Models/Job.js'
const jobRouter = express.Router();

// Simple Get Route to render the homepage.
jobRouter.get('/', async (req, res) => {
    const user1ID = '67f02ba8e024e20e6705746b'
    const user1IDObject = new mongoose.Types.ObjectId(user1ID)

    const user1jobs = await Job.find({ userId: user1IDObject });

    res.render('myJobs', { user1jobs })
})

// Route to get the users jobs displayer.
// Currently using a test user's ID.
jobRouter.get('/myJobs', async (req, res) => {
    const user1ID = '67f02ba8e024e20e6705746b'
    const user1IDObject = new mongoose.Types.ObjectId(user1ID)

    const user1jobs = await Job.find({ userId: user1IDObject });

    res.render('myJobs', { user1jobs })
})

jobRouter.get('/new', (req, res) => {
    res.render('newJob');
})

jobRouter.post('/myJobs', async (req, res) => {
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
})

jobRouter.get('/myJobs/:_id/edit', async (req, res) => {
    const { _id } = req.params;
    const job = await Job.findById(_id);
    res.render('edit', ({ job }));
})

jobRouter.put('/myJobs/:_id', async (req, res) => {
    const { _id } = req.params;
    const newJob = await Job.findByIdAndUpdate(_id, req.body, { runValidators: true });
    res.redirect('/myJobs');
})

jobRouter.delete('/myJobs/:_id', async (req, res) => {
    const { _id } = req.params;
    await Job.findByIdAndDelete(_id);
    res.redirect('/myJobs');
})

export default jobRouter;