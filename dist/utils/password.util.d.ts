export declare const HashPassword: (password: string) => Promise<string>;
export declare const ComparePassword: (password: string, hashPassword: string) => Promise<Boolean>;
