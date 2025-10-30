interface SendEmailOptions {
    to: string;
    subject: string;
    otp: string;
}
interface WelcomeEmailOptions {
    to: string;
    subject: string;
    name: string;
}
export declare function sendOtpEmail({ to, subject, otp }: SendEmailOptions): Promise<void>;
export declare function welcomeEmail({ name, subject, to }: WelcomeEmailOptions): Promise<void>;
export {};
