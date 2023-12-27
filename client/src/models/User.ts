import { Department } from "./Department";

export interface User {
    userId: number;
    name: string
    email: string;
    roles: string[];
    department: Department;
}