import axios from "axios";
import { SignInRequest } from "../models/api/SignInRequest";
import { SignInResponse } from "../models/api/SignInResponse";
import { RegisterRequest } from "../models/api/RegisterRequest";
import { NewPasswordRequest } from "../models/api/NewPasswordRequest";
import { PasswordChangeRequest } from "../models/api/PasswordChangeRequest";

export class AuthApi {
    static signIn = async (request: SignInRequest) =>
        await axios.post<SignInResponse>(`/api/v1/auth/authenticate`, request);

    static signUp = async (request: RegisterRequest) =>
        await axios.post<SignInResponse>(`/api/v1/auth/register`, request);

    static forgotPassword = async (requestParam: string) =>
        await axios.post<string>(`/api/v1/auth/reset-password`, null, {
            params: {
                email: requestParam,
            },
        });

    // static resetPassword = async (request: string) =>
    //     await axios.post<string>(`/api/v1/auth/reset-password?email=${request}`);

    static resetPassword = async (request: NewPasswordRequest, token: string) =>
        await axios.patch<string>(`/api/v1/auth/reset-password/${token}`, request);

    static changePassword = async (request: PasswordChangeRequest) =>
        await axios.post<SignInResponse>(`/api/v1/auth/change-password`, request);

    static refreshTokens = async (jwtRefreshToken: string) =>
        await axios.post<SignInResponse>("/api/v1/auth/refresh-token", null, {
            headers: {
                Authorization: `Bearer ${jwtRefreshToken}`,
            },
        });

    static logout = async (jwtToken: string) =>
        await axios.post<void>("/api/v1/auth/logout", null, {
            headers: {
                Authorization: `Bearer ${jwtToken}`,
            },
        });

    static verifyRecaptcha = async (reCaptchaToken: string | null) =>
        await axios.post<any>("/api/v1/auth/recaptcha", null, {
            params: {
                "g-recaptcha-response": reCaptchaToken,
            },
        });
}
