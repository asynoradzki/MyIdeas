export interface ThreadUpdateDTO {
    email: string;
    title: string | null;
    description: string | null;
    justification: string | null;
    points: number | null;
    categoryId: number | null;
    stageId: number | null;
    statusId: number| null;
}