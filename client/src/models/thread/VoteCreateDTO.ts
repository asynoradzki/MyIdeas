export interface VoteCreateDTO {
    threadId: number;
    userId: number;
    voteType: "LIKE" | "DISLIKE";
}
