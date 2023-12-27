import axios from "axios";
import { Role } from "../models/Role";

export class RoleApi {
    static getAllRoles = async () => await axios.get<Role[]>(`/roles/`);
}