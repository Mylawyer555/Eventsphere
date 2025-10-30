"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateOtpExpiry = exports.generateOtp = void 0;
const generateOtp = () => {
    return Math.floor(100000 + Math.random() * 900000).toString();
};
exports.generateOtp = generateOtp;
const generateOtpExpiry = () => {
    return new Date(Date.now() + 10 * 60 * 1000);
};
exports.generateOtpExpiry = generateOtpExpiry;
