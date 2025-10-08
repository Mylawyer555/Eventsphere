import {render} from '@react-email/render';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import React from 'react';
import OtpEmail from '../emails/OtpEmail';
import WelcomeEmail from '../emails/WelcomeEmail';

dotenv.config();

interface SendEmailOptions {
    to: string;
    subject:string;
    otp: string;
};

interface WelcomeEmailOptions {
    to: string;
    subject: string;
    name: string;
};

interface DeletionWarningEmail {
    to: string;
    subject: string;
    name: string;
    deletionDate: string;
};

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});

export async function sendOtpEmail({to, subject, otp}:SendEmailOptions){
    const emailHtml = await render(<OtpEmail otp={otp}/>)
    await transporter.sendMail({
        from: `'Eventsphere' <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: emailHtml,
    });
};

export async function welcomeEmail({name, subject, to}:WelcomeEmailOptions){
    const emailHtml = await render(<WelcomeEmail name={name}/>)
    await transporter.sendMail({
        from: `"Eventsphere" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: emailHtml,
    })
}