"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendOtpEmail = sendOtpEmail;
exports.welcomeEmail = welcomeEmail;
const render_1 = require("@react-email/render");
const nodemailer_1 = __importDefault(require("nodemailer"));
const dotenv_1 = __importDefault(require("dotenv"));
const react_1 = __importDefault(require("react"));
const OtpEmail_1 = __importDefault(require("../emails/OtpEmail"));
const WelcomeEmail_1 = __importDefault(require("../emails/WelcomeEmail"));
dotenv_1.default.config();
;
;
;
const transporter = nodemailer_1.default.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    },
});
async function sendOtpEmail({ to, subject, otp }) {
    const emailHtml = await (0, render_1.render)(react_1.default.createElement(OtpEmail_1.default, { otp: otp }));
    await transporter.sendMail({
        from: `'Eventsphere' <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: emailHtml,
    });
}
;
async function welcomeEmail({ name, subject, to }) {
    const emailHtml = await (0, render_1.render)(react_1.default.createElement(WelcomeEmail_1.default, { name: name }));
    await transporter.sendMail({
        from: `"Eventsphere" <${process.env.SMTP_USER}>`,
        to,
        subject,
        html: emailHtml,
    });
}
