import { authorizedApi } from "../hooks/withAxiosIntercepted";
import { Vote } from "../models/Vote";
import { VoteCreateDTO } from "../models/thread/VoteCreateDTO";

export class VoteApi {
    static addVote = async (request: VoteCreateDTO) => await authorizedApi.post<Vote>(`/votes/addVote`, request);

    static deleteVoteById = async (voteId: number) =>
        await authorizedApi.delete<string>(`http://localhost:8080/votes/${voteId}`);
}
