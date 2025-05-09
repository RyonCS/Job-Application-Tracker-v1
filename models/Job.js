import mongoose from 'mongoose';

// Job Schema for MongoDB.
const jobSchema = new mongoose.Schema(
    {
        date: {
            type: Date,
            default: Date.now,
        },
        company: {
            type: String,
            default: "N/A"
        },
        position: {
            type: String,
            default: "N/A"
        },
        location: {
            type: String,
            default: "N/A"
        },
        status: {
            type: String,
            enum: ['Applied', 'Interview', 'Offer', 'Rejected'],
            default: 'Applied'
        },
        linkToPosting: {
            type: String
        },
        userId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'User',
            required: true
        }
    }
)

const Job = mongoose.model('Job', jobSchema);

export default Job;