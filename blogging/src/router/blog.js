import express from "express";
import { Blogs } from "../model/blog.js";
import { auth } from "../middleware/auth.js";   

export const blogrouter = new express.Router();

blogrouter.post('/blogs', auth, async (req, res) => {
    console.log('hi');

    console.log(req.body);
    
    
    const blog = new Blogs({
        ...req.body,
        owner: req.user._id
    });
    console.log(blog);
    
    try {
        await blog.save();
        res.status(201).send(blog);
    } catch (e) {
        res.status(400).send(e);
    }
});

blogrouter.get('/view/blogs', auth , async (req, res) => {
    console.log('hi');
    
    try {
        const blogs = await Blogs.find({title: req.query.category });   
        console.log(blogs);
        
        res.send(blogs);
    } catch (e) {
        res.status(500).send();
    }
}); 
