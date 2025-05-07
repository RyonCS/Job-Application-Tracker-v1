import express from 'express';

const router = express.Router();

import {
    getAllJobs,
    newJobPage,
    addNewJob,
    editJobPage,
    editJob,
    deleteJob
 } from '../Controllers/jobController.js';

// Simple Get Route to render the homepage.
router.get('/myJobs', getAllJobs);

// Route to new job page.
router.get('/new', newJobPage);

// Route to edit job page.
router.get('/myJobs/:_id/edit', editJobPage);

// Route to add a new job.
router.post('/myJobs', addNewJob);

// Route to edit a specific job.
router.put('/myJobs/:_id', editJob);

// Route to delete a specific job.
router.delete('/myJobs/:_id', deleteJob);

export default router;