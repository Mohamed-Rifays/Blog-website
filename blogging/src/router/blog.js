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

    const sort = req.query.sort;

  const sortObj = sort === 'oldest'
    ? { createdAt: 1 }
    : { createdAt: -1 };
    
    try {
    const blogs = await Blogs
    .find({title: req.query.category })
    .sort(sortObj)
    .limit(parseInt(req.query.limit))
    .skip(parseInt(req.query.skip))
    .populate('owner');   

       
  
        res.send(blogs);
    } catch (e) {
        console.log(e);
        
        res.status(500).send();
    }
}); 

blogrouter.get('/blogs/me', auth, async (req, res) => {
    try {
        const sort = req.query.sort;
        const limit = parseInt(req.query.limit);
        const skip = parseInt(req.query.skip);
        const sortObj = sort === 'oldest'
            ? { createdAt: 1 }
            : { createdAt: -1 };

        const user = req.user;
        await user.populate({
            path:'blogs',
            options:{
            sort: sortObj,
            limit,
            skip
        }});
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
