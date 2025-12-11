import { Users } from "../model/user.js";
import express from "express";
import { auth } from "../middleware/auth.js";
import { sendWelcomeEmail,sendCancellationEmail,sendWelcomeBackEmail } from "../emails/account.js";


export const userrouter =new express.Router();

userrouter.post('/users',async (req,res)=>{
   
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
        console.log('hi');
        
        const user = await Users.findByCredentials(req.body.email, req.body.password);
        console.log(user);
        
        const token = await user.generateAuthToken();

        await user.save();
        sendWelcomeBackEmail(user.email,user.name);
        console.log(token);
        
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

