import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Blogs } from './blog.js';

dotenv.config();

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim:true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim:true,
    validate(value){
        if(!validator.isEmail(value)){
            throw new Error('Invalid email format');
        }
    }
  },
    password: {
    type: String,
    required: true,
    minlength: 6,
    trim:true
    },
    tokens: [{
        token: {
            type: String, 
            required: true
        }
    }]
}, { timestamps: true });

userSchema.virtual('blogs', {
    ref: 'Blogs',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    // Here you can add code to generate a token, for example using JWT:
     const token = jwt.sign({ _id: user._id.toString() }, process.env.JWT_SECRET);
     user.tokens = user.tokens.concat({ token });
   
     return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await Users.findOne({ email });
    if (!user) {
        throw new Error('Unable to login');
    } 
    const isMatch = await bcrypt.compare(password, user.password);
    
    if (!isMatch) {
        throw new Error('Unable to login');
    }
    return user;
};


 userSchema.pre('save',async function (){
        const user = this
        if(user.isModified('password')) {
             user.password = await bcrypt.hash(user.password,8);
        }
       
        
    })



export const Users = mongoose.model('User', userSchema);