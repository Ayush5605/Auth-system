import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

const transporter=nodemailer.createTransport({

    host:'smtp.gmail.com',
    port:465,
    secure:true,
    auth:{
        user:process.env.SMTP_USER,
        pass:process.env.SMTP_PASS
       
    }

});

transporter.verify((err, success) => {
    if (err) console.error("❌ SMTP verification failed:", err);
    else console.log("✅ SMTP ready to send emails");
});

export default transporter;