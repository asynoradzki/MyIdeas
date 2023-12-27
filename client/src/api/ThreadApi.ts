import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { Thread } from "../models/thread/Thread";
import { GetThreadsRequest } from "../models/api/GetThreadsRequest";
import { ThreadUpdateDTO } from "../models/thread/ThreadUpdateDTO";
import { toast } from "react-toastify";
import { ThreadCreateDTO } from "../models/thread/ThreadCreateDTO";

export class ThreadApi {
    static getThreadsPageable = async (requestParams: GetThreadsRequest) => {
        return await authorizedApi.get<any>(`/threads/`, {
            params: {
                ...requestParams,
            },
        });
    };

    static getThreadById = async (threadId: number) => await authorizedApi.get<Thread>(`/threads/id/${threadId}`);

    static getPhoto = async (downloadUri: string) =>
        await authorizedApi.get<any>(`${downloadUri}`, {
            responseType: "blob",
        });

    static updateThreadById = async (threadId: number, file: File | null, data: ThreadUpdateDTO) => {
        const formData = new FormData();
        if (file) {
            formData.append("file", file);
        }
        formData.append("thread", JSON.stringify(data));

        return await authorizedApi.patch<Thread>(`/threads/id/${threadId}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
    };

    static addThread = async (data: ThreadCreateDTO, file: File | null) => {
        const formData = new FormData();
        formData.append("model", JSON.stringify(data));

        if (file) {
            formData.append("file", file);
        }

        return await authorizedApi.post<Thread>(`/threads/addThread`, formData, {
            headers: {
                "Content-Type": "multipart/formData",
            },
        });
    };

    static updatePointsInThreadById = async (threadId: number, points: number) => {
        try {
            const response = await authorizedApi.patch<Thread>(`/threads/points/id/${threadId}`, { points: points });
            return response.data;
        } catch (error: any) {
            toast.error("An error occured when trying to connect to server", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    static deleteThreadById = async (threadId: number) => await authorizedApi.delete<Thread>(`/threads/${threadId}`);
}
