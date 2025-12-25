import { Users } from "../model/user.js";
import express from "express";
import { auth } from "../middleware/auth.js";
import multer from "multer";
import sharp from "sharp";
import { sendWelcomeEmail,sendCancellationEmail,sendWelcomeBackEmail } from "../emails/account.js";


export const userrouter =new express.Router();

const upload = multer({
  limits: {
    fileSize: 1 * 1024 * 1024
  }
});


userrouter.post('/users/me/avatar',auth, upload.single('avatar'), async (req,res)=>{
    try{
        const buffer = await sharp(req.file.buffer).resize({ width: 250, height: 250 }).png().toBuffer();
        req.user.avatar = buffer;
        await req.user.save();
        res.send();
    }catch(e){
        res.status(400).send(e);
    }
});

userrouter.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await Users.findById(req.params.id);
        if (!user || !user.avatar) {
            throw new Error();
        }
        res.set('Content-Type', 'image/png');
        res.send(user.avatar);
    } catch (e) {
        res.status(404).send();
    }
});

userrouter.delete('/users/me/avatar',auth, async (req,res)=>{
    try{
        req.user.avatar = undefined;
        await req.user.save();
        res.send();
    }catch(e){
        res.status(500).send();
    }
});

userrouter.post('/users',async (req,res)=>{
   console.log('hi');
   
    try{
    const user = new Users(req.body);
    
   
     const token = await user.generateAuthToken();
  
        await user.save();
        sendWelcomeEmail(user.email,user.name);

        res.status(201).send({ user, token });
    }catch(e){
        console.log(e);
        
        res.status(400).send(e);
    }
});

userrouter.post('/users/login',async (req,res)=>{
    try{
        
        const user = await Users.findByCredentials(req.body.email, req.body.password);
        
        const token = await user.generateAuthToken();

        await user.save();
         sendWelcomeBackEmail(user.email,user.name);
        
        res.send({user, token});
    }catch(e){ 

        res.status(500).send(e);
    }
}
);


userrouter.post('/users/logout',auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {       

            return token.token !== req.token;
        }
        );
        await req.user.save();
        res.send();
    }
    catch (e) {
        res.status(500).send();
    }
});

userrouter.get('/users/me',auth, async (req,res)=>{
    res.send(req.user);
});

userrouter.patch('/users/me',auth, async (req,res)=>{
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name','email','password'];
    const isValidOperation = updates.every((update)=> allowedUpdates.includes(update)); 
    if(!isValidOperation){
        return res.status(400).send({error: 'Invalid updates!'});
    }
    try{
        updates.forEach((update)=> req.user[update] = req.body[update]);
        await req.user.save();
        res.send(req.user);
    }catch(e){
        res.status(400).send(e);
    }
});

userrouter.delete('/users/me',auth, async (req,res)=>{
    try{
        await req.user.remove();
         sendCancellationEmail(req.user.email,req.user.name);
        res.send(req.user);
    }catch(e){
        res.status(500).send();
    }
});





