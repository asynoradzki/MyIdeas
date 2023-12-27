import { Admission } from "../Admission";
import { Category } from "../Category";
import { Comment } from "../Comment";
import { Conclusion } from "../Conclusion";
import { Stage } from "../Stage";
import { Status } from "../Status";
import { User } from "../User";
import { Vote } from "../Vote";

export interface Thread {
    threadId: number;
    date: Date; //
    title: string; //user
    description: string; //user
    justification: string; //user
    photo: string; //user
    points: number;
    user: User; //
    category: Category; //user
    stage: Stage; //admin
    status: Status; //admin
    comments: Comment[];
    votes: Vote[];
    admission: Admission; //admin
    conclusion: Conclusion; //admin
}
