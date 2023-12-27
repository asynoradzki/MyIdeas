import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { Status } from "../models/Status";

export class StatusApi {
    static getAllStatuses = async () => await authorizedApi.get<Status[]>(`/status/`);
}