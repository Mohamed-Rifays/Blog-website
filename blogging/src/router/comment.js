import { comment } from "../model/comments.js";
import express from "express";
import { auth } from "../middleware/auth.js";

export const commentRouter = new express.Router();

commentRouter.post('/blogs/:id/comments',auth, async (req, res) => {
    
    
    try {
        const newComment = new comment({
            user: req.user._id,
            content: req.body.content,
            blogId: req.params.id
        });
        await newComment.save();
        res.status(201).send(newComment);
    } catch (e) {
        res.status(400).send(e);
    }
});

commentRouter.get('/blogs/:id/comments',auth, async (req, res) => {
    try {
        const comments = await comment.find({ blogId: req.params.id }).populate('user', 'name avatar').sort({ createdAt: 1 });
        res.send(comments);
    } catch (e) {
        res.status(500).send();
    }
});