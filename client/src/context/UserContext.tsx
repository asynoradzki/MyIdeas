import { createContext, useEffect, useState } from "react";
import { UserFromToken } from "../models/UserFormToken";
import { UserContextType } from "../models/UserContextType";
import { ACCESS_TOKEN } from "../constants/constants";
import jwtDecode from "jwt-decode";

const defaultSettings: UserContextType = {
    currentUser: null,
    userModifier: (user: UserFromToken | null) => {},
};

export const UserContext = createContext<UserContextType>(defaultSettings);

export const UserContextProvider = ({ children }: React.PropsWithChildren) => {
    const [currentUser, setCurrentUser] = useState<UserFromToken | null>(null);

    const userModifier = (user: UserFromToken | null) => {
        setCurrentUser(user);
    };

    // Po uruchomieniu aplikacji sprawdza czy jest token w local storage i ustawia current usera
    useEffect(() => {
        const token: string | null = localStorage.getItem(ACCESS_TOKEN);
        if (token) {
            const decodedAccessToken: UserFromToken = jwtDecode(token);
            userModifier({ ...decodedAccessToken });
        }
    }, []);

    return <UserContext.Provider value={{ currentUser, userModifier }}>{children}</UserContext.Provider>;
};
