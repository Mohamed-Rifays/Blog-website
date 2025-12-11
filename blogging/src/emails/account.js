import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.GMAIL_USER,
        pass: process.env.GMAIL_PASS,
    },
});

export const sendWelcomeEmail = async(email, name) => {
    try{
    const info = await
    transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome to Our Blogging Platform!',
        text: `Hi ${name},\n\nWelcome to our blogging platform! We're excited to have you on board.\n\nBest regards,\nThe Blogging Team`,
    });
    console.log('Email sent: ' + info.response);
}catch(e){
    console.log('Error sending email: ' + e.message);
    
}   
};
export const sendCancellationEmail = async(email, name) => {
    try{
    const info = await
    transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Sorry to see you go!',
        text: `Hi ${name},\n\nWe're sorry to see you leave our blogging platform. If you have any feedback, please let us know.\n\nBest regards,\nThe Blogging Team`,
    });
    console.log('Email sent: ' + info.response);
}catch(e){
    console.log('Error sending email: ' + e.message);
    
}
};

export const sendWelcomeBackEmail = async(email, name) => {
    try{
    const info = await
    transporter.sendMail({
        from: process.env.GMAIL_USER,
        to: email,
        subject: 'Welcome Back to Our Blogging Platform!',
        text: `Hi ${name},\n\nWelcome back to our blogging platform! We're excited to have you on board again.\n\nBest regards,\nThe Blogging Team`,
    });
    console.log('Email sent: ' + info.response);
}catch(e){
    console.log('Error sending email: ' + e.message);   

}
};   

