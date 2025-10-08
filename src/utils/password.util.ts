import bcrypt from 'bcryptjs'

const SALT_ROUNDS = 10; 

export const HashPassword = async (password:string): Promise<string> =>{
    return await bcrypt.hash(password,SALT_ROUNDS);
};

export const ComparePassword = async (password:string, hashPassword:string): Promise<Boolean> => {
    return await bcrypt.compare(password, hashPassword);
};