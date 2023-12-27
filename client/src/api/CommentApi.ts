import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { Comment } from "../models/Comment";
import { CommentCreateDTO } from "../models/thread/CommentCreateDTO";

export class CommentApi {
    static addComment = async (request: CommentCreateDTO) =>
        await authorizedApi.post<Comment>(`/comments/addComment`, request);

    static deleteCommentById = async (commentId: number) =>
        await authorizedApi.delete<boolean>(`/comments/${commentId}`);

    static getCommentsByThreadId = async (threadId: number) =>
        await authorizedApi.get<Comment[]>(`/comments/thread/${threadId}`);
}
