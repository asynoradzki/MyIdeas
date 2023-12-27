import { useCallback, useEffect, useState } from "react";
import {
    LoginInputContainer,
    LoginBrandingContainer,
    LoginButton,
    LoginContainer,
    LoginIdeasIcon,
    LoginInput,
    LoginPageContainer,
    ValidationError,
    LoginButtonContainer,
    LoginLink,
    LoginLinkContainer,
    LoginLinkSpan,
    DivWrapper,
} from "./Login.styles";
import { AuthApi } from "../../api/AuthApi";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { validateEmailRFC2822 } from "./LoginHelpers";

export const ForgotPassword = () => {
    const navigate = useNavigate();

    const [email, setEmail] = useState<string>("");
    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);

    const onLoginClicked = useCallback(async () => {
        try {
            const result = await AuthApi.forgotPassword(email);

            toast.success(result.data, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });

            navigate("/login");
        } catch (error: any) {
            let message: string;

            if (error.response && error.response.status === 404) {
                message = error.response.data;
            } else {
                message = "An error occured when trying to connect to server";
            }
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, [email, navigate]);

    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.currentTarget.value);
    };

    useEffect(() => {
        setIsEmailValid(validateEmailRFC2822(email));
    }, [email]);

    return (
        <div>
            <LoginPageContainer>
                <LoginBrandingContainer>
                    <LoginIdeasIcon />
                </LoginBrandingContainer>
                <LoginContainer>
                    <LoginInputContainer>
                        <DivWrapper>
                            <LoginInput placeholder="E-mail *" type="text" onChange={(e) => onEmailChange(e)} />
                            {!isEmailValid && <ValidationError>Please privide e-mail</ValidationError>}
                        </DivWrapper>

                        <LoginButtonContainer>
                            <LoginButton disabled={!isEmailValid} onClick={onLoginClicked}>
                                Reset Password
                            </LoginButton>
                            <LoginLinkContainer>
                                <LoginLink to={"/login"}>
                                    <LoginLinkSpan>Remember password?</LoginLinkSpan> Sign in
                                </LoginLink>
                                <LoginLink to={"/register"}>
                                    <LoginLinkSpan>Don't have an account?</LoginLinkSpan> Sign up
                                </LoginLink>
                            </LoginLinkContainer>
                        </LoginButtonContainer>
                    </LoginInputContainer>
                </LoginContainer>
            </LoginPageContainer>
        </div>
    );
};
