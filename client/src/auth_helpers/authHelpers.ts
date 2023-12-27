import jwtDecode from "jwt-decode";
import { SignInResponse } from "../models/api/SignInResponse";
import { AuthApi } from "../api/AuthApi";
import { ACCESS_TOKEN, REFRESH_TOKEN } from "../constants/constants";

export const getJwtToken = async (): Promise<string | null> => {
    const jwtToken: string | null = localStorage.getItem(ACCESS_TOKEN);

    if (verifyIfTokenIsValid(jwtToken)) {
        return jwtToken;
    }
    const jwtRefreshToken: string | null = localStorage.getItem(REFRESH_TOKEN);

    if (!verifyIfTokenIsValid(jwtRefreshToken)) {
        if (jwtToken) {
            handleLogout(jwtToken);
        }
        return null;
    }

    const newTokens: SignInResponse | null = await getNewTokens(jwtRefreshToken!);

    if (newTokens) {
        saveTokensToLocaleStorage(newTokens);
        return newTokens.access_token;
    }

    return null;
};

const getNewTokens = async (jwtRefreshToken: string): Promise<SignInResponse | null> => {
    try {
        const response = await AuthApi.refreshTokens(jwtRefreshToken);
        return response.data;
    } catch (error: any) {
        let message: string;

        if (error.response && error.response.status === 403) {
            message = "Incorrect refresh token";
        } else {
            message = "An error occured when trying to connect to server";
        }
        console.log(message);
        
        return null;
        // console.log("Błąd podczas odświeżania tokena:");
    }
};


function isTokenExpired(tokenExp: number, currentTimestamp: number): boolean {
    const tenSeconds: number = 10;
    return tokenExp < currentTimestamp - tenSeconds;
}

export function saveTokensToLocaleStorage({
    access_token,
    refresh_token,
}: {
    access_token: string;
    refresh_token: string;
}): void {
    localStorage.setItem(ACCESS_TOKEN, access_token);
    localStorage.setItem(REFRESH_TOKEN, refresh_token);
}

function verifyIfTokenIsValid(jwtToken: string | null): boolean {
    const currentTimestamp = Math.round(Date.now() / 1000);
    if (jwtToken === null || jwtToken.length === 0) {
        return false;
    }
    const decodedToken = jwtDecode(jwtToken) as any;
    const tokenExp = decodedToken.exp as number;

    return !isTokenExpired(tokenExp, currentTimestamp);
}

export const handleLogout = async (jwtToken: string) => {
    try {
        await AuthApi.logout(jwtToken);
    } catch (error: any) {
        console.log("An error on the server occurred while logging out");
    }
    
    localStorage.clear();
};