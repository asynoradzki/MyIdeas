import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { AdmissionCreateDTO } from "../models/thread/AdmissionCreateDTO";
import { Admission } from "../models/Admission";
import { AdmissionUpdateDTO } from "../models/thread/AdmissionUpdateDTO";

export class AdmissionApi {
    static addAdmission = async (request: AdmissionCreateDTO) =>
        await authorizedApi.post<Admission>(`/admission/add`, request);

    static updateAdmissionById = async (admissionId: number, request: AdmissionUpdateDTO) =>
        await authorizedApi.patch<Admission>(`/admission/${admissionId}`, request);
}
