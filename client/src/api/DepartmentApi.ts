import axios from "axios";
import { Department } from "../models/Department";

export class DepartmentApi {
    static getAllDepartments = async () => await axios.get<Department[]>(`/departments/`, {
        headers: {
            accept: 'application/json',
        }
    });
}