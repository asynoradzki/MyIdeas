import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { ConclusionCreateDTO } from "../models/thread/ConclusionCreateDTO";
import { Conclusion } from "../models/Conclusion";
import { ConclusionUpdateDTO } from "../models/thread/ConclusionUpdateDTO";

export class ConclusionApi {
    static addConclusion = async (request: ConclusionCreateDTO) =>
        await authorizedApi.post<Conclusion>(`/conclusion/add`, request);

    static updateConclusionById = async (conclusionId: number, request: ConclusionUpdateDTO) =>
        await authorizedApi.patch<Conclusion>(`/conclusion/${conclusionId}`, request);
}
