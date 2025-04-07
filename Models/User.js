import mongoose from 'mongoose';
import passportLocalMongoose from 'passport-local-mongoose';
const Schema = mongoose.Schema;

// User Schema for MongoDB.
const userSchema = new Schema(
    {
        emailAddress: {
            type: String,
            required: true,
            unique: true,
        },
        password: {
            type: String,
            required: true
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }
);
// Adds username and password to schema.
//userSchema.plugin(passportLocalMongoose);

export default mongoose.model('User', userSchema);