export interface Vote {
    id: number;
    threadId: number;
    userId: number;
    voteType: "LIKE" | "DISLIKE";
}
