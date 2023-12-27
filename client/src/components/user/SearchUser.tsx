import { useCallback, useEffect, useMemo, useState } from "react";
import { User } from "../../models/User";
import { UserApi } from "../../api/UserApi";
import { toast } from "react-toastify";
import { debounce } from "lodash";
import { InputAdornment, List, ListItem, TextField, useMediaQuery } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import { SearchContentsContainer, SearchResultsContainer, SearchWindowContainer } from "./SearchUser.styles";
import { LILLA_LIGHT } from "../../constants/colors";

interface SearchUserProps {
    onSelectedUser: (user: User | null) => void;
    selectedUser: User | null;
}

export const SearchUser = ({ selectedUser, onSelectedUser }: SearchUserProps) => {
    const [searchTerm, setSearchTerm] = useState<string>("");
    const [users, setUsers] = useState<User[]>([]);
    const [shouldSearch, setShouldSearch] = useState<boolean>(false);
    const [shouldDisplayResults, setShouldDisplayResults] = useState<boolean>(false);
    const [isBlur, setIsBlur] = useState<boolean>(false);

    const isSmallScreen = useMediaQuery("(max-width:600px)");
    const textFieldSize = isSmallScreen ? "small" : "medium"; // Adjust the breakpoint and size as needed

    useEffect(() => {
        if (selectedUser === null) {
            setSearchTerm("");
        }
    }, [selectedUser]);

    const searchUsers = useCallback(async (searchEmail: string) => {
        try {
            const response = await UserApi.searchUsersByEmail(searchEmail);
            setUsers(response.data);

            // console.log("response.data", response.data);
        } catch (error) {
            toast.error("An error occured when trying to connect to server", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, []);

    const debouncedSearch = useMemo(
        () =>
            debounce((searchEmail: string) => {
                return searchUsers(searchEmail);
            }, 1200),
        [searchUsers]
    );

    useEffect(() => {
        if (shouldSearch) {
            debouncedSearch(searchTerm);
            setShouldSearch(false);
        }
        if (!searchTerm) {
            setUsers([]);
            onSelectedUser(null);
        }
    }, [searchTerm, debouncedSearch, shouldSearch, onSelectedUser]);

    const onSearchTermChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setSearchTerm(e.target.value);
        if (e.target.value.length > 3) {
            setShouldSearch(true);
        }
    };

    const onListItemClick = (user: User) => {
        // console.log("user.name: ", user.name);
        setShouldSearch(false);
        setSearchTerm(user.email);
        // searchUsers(user.email);
        setShouldDisplayResults(false);
        return onSelectedUser(user);
    };

    const onClearClick = () => {
        setSearchTerm("");
        setUsers([]);
    };

    const onSearchWindowFocus = () => {
        setShouldDisplayResults(true);
    };

    const onSearchWindowBlur = () => {
        setIsBlur(true);
    };

    useEffect(() => {
        // console.log("Component mounted");

        if (isBlur) {
            const timeoutId = setTimeout(() => {
                if (isBlur) {
                    setShouldDisplayResults(false);
                    setIsBlur(false);
                }
                // console.log("setTimeout");
            }, 200);

            return () => {
                // console.log("Component unmounted");
                return clearTimeout(timeoutId);
            };
        }
    }, [isBlur]);

    return (
        <SearchContentsContainer>
            <SearchWindowContainer>
                <TextField
                    color="secondary"
                    // sx={{ backgroundColor: "white" }}
                    fullWidth
                    id="user_search_field"
                    // label="Search e-mail"
                    value={searchTerm}
                    onChange={onSearchTermChange}
                    onFocus={() => onSearchWindowFocus()}
                    onBlur={() => onSearchWindowBlur()}
                    placeholder="Search users"
                    size={textFieldSize}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <CloseIcon sx={{ cursor: "pointer" }} onClick={() => onClearClick()} />
                            </InputAdornment>
                        ),
                    }}
                />
            </SearchWindowContainer>
            {users.length > 0 && shouldDisplayResults && (
                // {users.length > 0 && (
                <SearchResultsContainer>
                    <List>
                        {users.map((user, index) => (
                            <ListItem
                                key={`${user.name}_${index}`}
                                onClick={() => onListItemClick(user)}
                                sx={{
                                    cursor: "pointer",
                                    "&:hover": {
                                        backgroundColor: `${LILLA_LIGHT}`, // Change the color to your desired hover color
                                    },
                                }}
                            >
                                {user.email}
                            </ListItem>
                        ))}
                    </List>
                </SearchResultsContainer>
            )}
        </SearchContentsContainer>
    );
};
