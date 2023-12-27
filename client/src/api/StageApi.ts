import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { Stage } from "../models/Stage";

export class StageApi {
    static getAllStages = async () => await authorizedApi.get<Stage[]>(`/stages/`);
}