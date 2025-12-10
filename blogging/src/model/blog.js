import mongoose from "mongoose";
import validator from "validator";

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },  
    subtitle: {
        type: String,
        required: true,
        trim: true
    },
    content: {
        type: String,
        required: true,
        trim: true
    },  
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Users'
    }

}, { timestamps: true });

export const Blogs = mongoose.model('Blogs', blogSchema);