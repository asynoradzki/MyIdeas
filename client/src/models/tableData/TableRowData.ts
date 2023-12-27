import { DefaultSortDir } from "./DefaultSortDir";


export type TableRowData = {
    mdDownInclude: boolean;
    fieldToSort: string;
    sortDir: DefaultSortDir;
    label: string;
};
