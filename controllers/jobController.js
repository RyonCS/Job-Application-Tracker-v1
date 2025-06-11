import Job from "../models/Job.js";
import mongoose from "mongoose";

function parseJobQueryParams(queryParams, userId) {
  const sortMap = {
    dateAsc: { date: 1 },
    dateDesc: { date: -1 },
    locationAsc: { location: 1 },
    locationDesc: { location: -1 },
  };

  const sort = queryParams.sort;
  const filter = queryParams.filter;
  const search = queryParams.searchByCompany;

  const sortOption = sortMap[sort] || { date: -1 };
  const query = { userId };

  if (filter === "excludeRejected") {
    query.status = { $ne: "Rejected" };
  }

  if (search) {
    query.company = { $regex: new RegExp(search, "i") };
  }

  return { query, sortOption, sort, filter, search };
}

// Get and display all of the user's jobs.
export const getAllJobs = async (req, res) => {
  // Get the current session ID - userID.
  const loggedInUserID = req.session.user_id;
  // If session ID isnt found, redirect to login.
  if (!loggedInUserID) {
    return res.redirect("/auth/login");
  }

  const { query, sortOption, sort, filter, search } = parseJobQueryParams(
    req.query,
    loggedInUserID,
  );

  const userJobs = await Job.find(query).sort(sortOption);
  res.render("myJobs", { userJobs, sort, filter, search });
};

// Display the new Job Page.
export const newJobPage = (req, res) => {
  const date = new Date();
  console.log(date)
  res.render("newJob", {date});
};

// Add a new job.
export const addNewJob = async (req, res) => {
  // Create job and get userId from session.
  const loggedInUserID = req.session.user_id;
  const loggedInUserIDObject = new mongoose.Types.ObjectId(loggedInUserID);

  // Add in time to date for better filtering.
  if (req.body.date) {
    const [year, month, day] = req.body.date.split("-");
    const now = new Date();

    req.body.date = new Date(
      parseInt(year),
      parseInt(month) - 1,
      parseInt(day),
      now.getHours(),
      now.getMinutes(),
      now.getSeconds(),
    );
  } else {
    req.body.date = new Date();
  }

  // Create a new job.
  const newJobData = {
    ...req.body,
    userId: loggedInUserIDObject,
  };

  const newJob = new Job(newJobData);
  await newJob.save();

  res.redirect("/jobs/myJobs");
};

// Display edit job page.
export const editJobPage = async (req, res) => {
  const jobId = req.params._id;
  const userId = req.session.user_id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      return res.redirect("/jobs/myJobs");
    }

    if (!job.userId.equals(userId)) {
      return res.redirect("/jobs/myJobs");
    }

    res.render("edit", { job });
  } catch (err) {
    return res.redirect("/jobs/myJobs");
  }
};

// Edit a job.
export const editJob = async (req, res) => {
  // Get the id for the job and update it.
  const jobId = req.params._id;
  const userId = req.session.user_id;

  try {
    const job = await Job.findById(jobId);
    if (!job) {
      res.redirect("/jobs/myJobs");
    }
    console.log("Job from DB:", job);
    if (!job.userId.equals(userId)) {
      res.redirect("/jobs/myJobs");
    }
    await Job.findByIdAndUpdate(jobId, req.body, { runValidators: true });

    res.redirect("/jobs/myJobs");
  } catch (err) {
    console.error(err);
    res.redirect("/jobs/myJobs");
  }
};

// Delete a job.
export const deleteJob = async (req, res) => {
  // Get the id for the job and delete it.
  const { _id } = req.params;
  await Job.findByIdAndDelete(_id);
  res.redirect("/jobs/myJobs");
};
