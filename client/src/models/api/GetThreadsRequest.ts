import { SortDirection } from "./SortDirection";

export type GetThreadsRequest = {
    pageNo: number;
    pageSize: number;
    searchedTitle?: string | null;
    filterStatusId?: number | null;
    fieldToSort?: string | null;
    sortDirection?: SortDirection;
}