import mongoose from "mongoose";
import validator from "validator";

const normalizeTitleCategory = (v = '') => {
  v = v.toLowerCase().trim();

  // normalize category logic
  if (v === 'movie') v = 'movies';
  if (v === 'mobiles') v = 'mobile';

  // capitalize for display
  return v.charAt(0).toUpperCase() + v.slice(1);
};


const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true,
        set: normalizeTitleCategory
    },  
    subtitle: {
        type: String,
        required: true,
        trim: true,
        set: v => v ? v.charAt(0).toUpperCase() + v.slice(1) : v
    },
    content: {
        type: String,
        required: true,
        trim: true
    },  
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }

}, { timestamps: true });

export const Blogs = mongoose.model('Blogs', blogSchema);