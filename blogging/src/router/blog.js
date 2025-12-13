import express from "express";
import { Blogs } from "../model/blog.js";
import { auth } from "../middleware/auth.js";   
import path from "path";
import { Users } from "../model/user.js";

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
    const blogs = await Blogs
    .find({title: req.query.category })
     .populate('owner');   

        console.log(blogs);
  
        res.send(blogs);
    } catch (e) {
        console.log(e);
        
        res.status(500).send();
    }
}); 

blogrouter.get('/blogs/me', auth, async (req, res) => {
    try {
        const user = req.user;
        await user.populate('blogs');
        res.send(user.blogs);
    } catch (e) {
        res.status(500).send();
    }   
});

blogrouter.delete('/blogs/:id', auth, async (req, res) => {
    try {
        const blog = await Blogs.findOneAndDelete({ _id: req.params.id, owner: req.user._id }); 
        if (!blog) {
            return res.status(404).send();
        }
        res.send(blog);
    } catch (e) {
        res.status(500).send();
    }   
});

blogrouter.patch('/blogs/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'subtitle', 'content'];
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' });
    }
    try {
        const blog = await Blogs.findOne({ _id: req.params.id, owner: req.user._id });
        if (!blog) {
            return res.status(404).send();
        }   
        updates.forEach((update) => blog[update] = req.body[update]);
        await blog.save();
        res.send(blog);
    } catch (e) {
        res.status(400).send(e);
    }
});
