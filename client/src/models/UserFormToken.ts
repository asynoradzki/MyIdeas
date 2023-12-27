export type UserFromToken = {
    user_id: number;
    name: string;
    role: string;
    sub: string;
    exp: number;
};
