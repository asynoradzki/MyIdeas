import { useCallback, useEffect, useMemo, useState } from "react";
import { ContentsContainer, FlexDiv, OrangeStripe, MainContainer } from "./Threads.styles";
import { ThreadApi } from "../../api/ThreadApi";
import { Thread } from "../../models/thread/Thread";
import { GetThreadsRequest } from "../../models/api/GetThreadsRequest";
import {
    Box,
    Button,
    Hidden,
    InputAdornment,
    MenuItem,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TablePagination,
    TableRow,
    TableSortLabel,
    TextField,
} from "@mui/material";
import { SortDirection } from "../../models/api/SortDirection";
import { debounce } from "lodash";
import { StatusApi } from "../../api/StatusApi";
import { Status } from "../../models/Status";
import { BLACK, LILLA } from "../../constants/colors";
import SearchIcon from "@mui/icons-material/Search";
import { Loader } from "../../router/App.styles";
import { useNavigate } from "react-router-dom";
import { TableRowData } from "../../models/tableData/TableRowData";
import { PAGE_SIZE } from "../../constants/constants";

const rowsPerPageOptions: number[] = [2, 4, 6];

// eslint-disable-next-line react-hooks/exhaustive-deps
// useEffect(() => {
// w ostatnie linii oznacza, że dotyczy całego kodu
// eslint-disable-next-line react-hooks/exhaustive-deps
// }, [])

const tableData: Record<string, TableRowData> = {
    date: { mdDownInclude: false, fieldToSort: "date", sortDir: "desc", label: "Date" },
    title: { mdDownInclude: false, fieldToSort: "title", sortDir: "asc", label: "Title" },
    author: { mdDownInclude: true, fieldToSort: "user.name", sortDir: "asc", label: "Author" },
    category: { mdDownInclude: true, fieldToSort: "category.categoryName", sortDir: "asc", label: "Category" },
    stage: { mdDownInclude: false, fieldToSort: "stage.stageName", sortDir: "asc", label: "Stage" },
    points: { mdDownInclude: true, fieldToSort: "points", sortDir: "desc", label: "Points" },
};

// czy spinnery powinny być na każde dane do ładowania osobne? isStatusLoading isThreadsLoading...

export const Threads = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [threads, setThreads] = useState<Thread[]>([]);
    const [statusList, setStatusList] = useState<Status[]>([]);
    const [threadsRequest, setThreadsRequest] = useState<GetThreadsRequest>({
        pageSize: localStorage.getItem(PAGE_SIZE) ? +localStorage.getItem(PAGE_SIZE)! : 2,
        pageNo: 0,
        searchedTitle: "",
        filterStatusId: null,
        fieldToSort: "date",
        sortDirection: SortDirection.DESC,
    });
    const [totalResults, setTotalResults] = useState<number>(0);
    const navigate = useNavigate();
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);

    useEffect(() => {
        const getAllStatuses = async () => {
            const response = await StatusApi.getAllStatuses();
            setStatusList(response.data);
            setThreadsRequest((prevState) => ({ ...prevState, filterStatusId: response.data[0].statusId }));
        };

        try {
            getAllStatuses();
        } catch (error) {
            console.error(error);
        }
    }, []);

    useEffect(() => {
        getThreadsPageable(threadsRequest);
    }, []);

    const getThreadsPageable = useCallback(async (request: GetThreadsRequest) => {
        try {
            setIsLoading(true);
            const response = await ThreadApi.getThreadsPageable(request);
            setThreads([...response.data.threads]);
            setTotalResults(response.data.totalResults);
            // console.log("getThreads");
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const debouncedSearch = useMemo(
        () =>
            debounce((request: GetThreadsRequest) => {
                return getThreadsPageable(request);
            }, 1200),
        [getThreadsPageable]
    );

    useEffect(() => {
        // if (threadsRequest.searchedTitle && threadsRequest.searchedTitle.length > minCharsToTriggerSearch) {
        //     debouncedSearch(threadsRequest);
        // } jak były ustawione minCharsToTriggerSearch to nie wracał po wymazaniu inputu
        if (shouldSearch) {
            debouncedSearch(threadsRequest);
            setShouldSearch(false);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [threadsRequest.searchedTitle, debouncedSearch]);

    const onSearchedTitleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setThreadsRequest((prevState) => {
            if (!e.target.value.length && prevState?.searchedTitle && prevState?.searchedTitle?.length) {
                setShouldSearch(true);
            }
            if (e.target.value.length > 3) {
                setShouldSearch(true);
            }
            return { ...prevState, searchedTitle: e.target.value };
        });
    };

    const handleChangePage = (event: React.MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        const request = { ...threadsRequest, pageNo: newPage };
        setThreadsRequest(request);
        getThreadsPageable(request);
        // localStorage.setItem(PAGE_NO, `${newPage}`);
    };

    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
        const request = { ...threadsRequest, pageNo: 0, pageSize: parseInt(event.target.value, 10) };
        setThreadsRequest(request);
        getThreadsPageable(request);
        localStorage.setItem(PAGE_SIZE, event.target.value);
    };

    const handleStatusChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const request = { ...threadsRequest, filterStatusId: +e.target.value };
        setThreadsRequest(request);
        getThreadsPageable(request);
    };

    const onResetClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const request = { ...threadsRequest, filterStatusId: 1, searchedTitle: "" };
        setThreadsRequest(request);
        getThreadsPageable(request);
        setShouldSearch(false);
    };

    const handleSortClick = (e: React.MouseEvent<HTMLSpanElement, MouseEvent>, field: string) => {
        if (threadsRequest.fieldToSort !== field) {
            const request = {
                ...threadsRequest,
                fieldToSort: field,
                sortDirection: field === "date" ? SortDirection.DESC : SortDirection.ASC,
            };
            setThreadsRequest(request);
            getThreadsPageable(request);
        } else {
            const request = {
                ...threadsRequest,
                sortDirection:
                    threadsRequest.sortDirection === SortDirection.ASC ? SortDirection.DESC : SortDirection.ASC,
            };
            setThreadsRequest(request);
            getThreadsPageable(request);
        }
    };

    return (
        <MainContainer>
            <OrangeStripe />
            <ContentsContainer>
                <Paper
                    elevation={4}
                    sx={{
                        width: "80vw",
                        p: 4,
                        minHeight: "60vh",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "flex-start",
                        left: "0",
                        right: "0",
                        margin: "0 auto",
                    }}
                >
                    <Stack sx={{ width: "100%", alignItems: "center", justifyContent: "center", minWidth: "370px" }}>
                        <Stack
                            sx={{
                                width: "95%",
                                marginBottom: 4,
                                flexDirection: { sm: "column", md: "row" },
                                gap: 2,
                                alignItems: "center",
                            }}
                        >
                            <FlexDiv>
                                <TextField
                                    color="secondary"
                                    sx={{ minwidth: "370px", cursor: "pointer" }}
                                    id="thread_search_field"
                                    label="Search title"
                                    placeholder="Search for ideas"
                                    value={threadsRequest.searchedTitle}
                                    onChange={onSearchedTitleChange}
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <SearchIcon />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            </FlexDiv>
                            <FlexDiv>
                                <Box width={150}>
                                    <TextField
                                        id="select_status_field"
                                        sx={{ marginTop: "0" }}
                                        label="Select status"
                                        select
                                        color="secondary"
                                        value={
                                            threadsRequest.filterStatusId !== null ? threadsRequest.filterStatusId : ""
                                        } //taki zapis zapobiega błędom w konsoli
                                        onChange={(e) => handleStatusChange(e)}
                                        fullWidth
                                    >
                                        {statusList.map((item, index) => (
                                            <MenuItem key={index} value={item.statusId}>
                                                {item.name}
                                            </MenuItem>
                                        ))}
                                    </TextField>
                                </Box>
                                <Box width={100}>
                                    <Button
                                        color="secondary"
                                        sx={{ marginTop: "0" }}
                                        fullWidth
                                        variant="contained"
                                        // color="info"
                                        disabled={
                                            threadsRequest.filterStatusId !== 1 || threadsRequest.searchedTitle
                                                ? false
                                                : true
                                        }
                                        onClick={onResetClick}
                                        size="large"
                                    >
                                        Reset
                                    </Button>
                                </Box>
                            </FlexDiv>
                        </Stack>
                        {isLoading ? (
                            <Loader />
                        ) : (
                            <Paper sx={{ width: "95%", marginBottom: 2 }}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            {Object.values(tableData).map((input, index) => (
                                                <Hidden key={index} {...(input.mdDownInclude ? { mdDown: true } : {})}>
                                                    <TableCell sx={{ fontWeight: "bold" }}>
                                                        <TableSortLabel
                                                            active={threadsRequest.fieldToSort === input.fieldToSort}
                                                            direction={
                                                                threadsRequest.fieldToSort === input.fieldToSort
                                                                    ? threadsRequest.sortDirection === SortDirection.ASC
                                                                        ? "asc"
                                                                        : "desc"
                                                                    : input.sortDir // Set your default direction here
                                                            }
                                                            onClick={(e) => handleSortClick(e, input.fieldToSort)}
                                                        >
                                                            {input.label}
                                                        </TableSortLabel>
                                                    </TableCell>
                                                </Hidden>
                                            ))}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {threads.map((thread, index) => (
                                            <TableRow
                                                key={index}
                                                sx={{
                                                    "&:hover": {
                                                        cursor: "pointer",
                                                        color: BLACK,
                                                        backgroundColor: LILLA,
                                                    },
                                                }}
                                                onClick={() => navigate(`/editThread/${thread.threadId}`)}
                                            >
                                                <Hidden>
                                                    <TableCell>{new Date(thread.date).toLocaleDateString()}</TableCell>
                                                </Hidden>
                                                <TableCell>{thread.title}</TableCell>
                                                <Hidden mdDown>
                                                    <TableCell>{thread.user.name}</TableCell>
                                                    <TableCell>{thread.category.categoryName}</TableCell>
                                                </Hidden>
                                                <TableCell>{thread.stage.stageName}</TableCell>
                                                <Hidden mdDown>
                                                    <TableCell sx={{ textAlign: "center" }}>{thread.points}</TableCell>
                                                </Hidden>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                                <TablePagination
                                    rowsPerPageOptions={rowsPerPageOptions}
                                    component="div"
                                    count={totalResults}
                                    rowsPerPage={threadsRequest.pageSize || rowsPerPageOptions[0] || 2}
                                    page={threadsRequest.pageNo}
                                    onPageChange={handleChangePage}
                                    onRowsPerPageChange={handleChangeRowsPerPage}
                                />
                            </Paper>
                        )}
                    </Stack>
                </Paper>
            </ContentsContainer>
        </MainContainer>
    );
};
