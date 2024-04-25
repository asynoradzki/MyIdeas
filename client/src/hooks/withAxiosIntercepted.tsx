import axios, { AxiosRequestConfig } from "axios";
import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/UserContext";
import jwtDecode from "jwt-decode";
import { UserFromToken } from "../models/UserFormToken";
import { getJwtToken } from "../auth_helpers/authHelpers";

export const authorizedApi = axios.create();

export function withAxiosIntercepted<T extends JSX.IntrinsicAttributes>(Component: React.ComponentType<T>) {
    return function AxiosIntercepted(props: T) {
        const navigate = useNavigate();
        const [isInitialized, setIsInitialized] = useState<boolean>(false);
        const { userModifier } = useContext(UserContext);

        useEffect(() => {
            axios.interceptors.request.use((config: AxiosRequestConfig) => {
                // console.log("config.headers", config.headers);
                return {
                    ...config,
                    baseURL: process.env.REACT_APP_API_URL,
                };
            });

            const updateUserContext = (jwtToken: string | null): void => {
                if (jwtToken) {
                    const decodedAccessToken: UserFromToken = jwtDecode(jwtToken);
                    userModifier({ ...decodedAccessToken });
                } else {
                    userModifier(null);
                }
            };

            authorizedApi.interceptors.request.use(async (config: AxiosRequestConfig) => {
                // const token: string | null = localStorage.getItem(ACCESS_TOKEN);
                const token: string | null = await getJwtToken();

                if (token) {
                    if (config?.headers) {
                        config.headers["Authorization"] = `Bearer ${token}`;
                        config.headers["accept"] = "*/*";
                        updateUserContext(token);
                    } else {
                        updateUserContext(null);
                    }
                }
                return {
                    ...config,
                    baseURL: process.env.REACT_APP_API_URL,
                };
            });

            authorizedApi.interceptors.response.use(
                (response) => {
                    return response; //.data
                },
                (error) => {
                    if (error.response.status === 401 || error.response.status === 403) {
                        localStorage.clear();
                        updateUserContext(null);
                        navigate("/login");
                    }
                    return Promise.reject(error);
                }
            );

            setIsInitialized(true);
        }, [navigate, userModifier]);

        return isInitialized ? <Component {...props} /> : <></>;
    };
}
