import { toast } from "react-toastify";
// import { useNavigate } from "react-router-dom";
import { useCallback, useEffect, useState } from "react";
import {
    CheckboxContainer,
    DivWrapper,
    LoginBrandingContainer,
    LoginButton,
    LoginContainer,
    LoginIdeasIcon,
    LoginInput,
    LoginInputContainer,
    // LoginLink,
    // LoginLinkContainer,
    // LoginLinkSpan,
    LoginPageContainer,
    ValidationError,
} from "./Login.styles";
import { AuthApi } from "../../api/AuthApi";
import { useParams } from "react-router-dom";

export const ResetPassword = () => {
    const { token: resetToken } = useParams();
    // const { userModifier } = useContext(UserContext);
    const [password, setPassword] = useState<string>("");
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isRepeatedPasswordValid, setIsRepeatedPasswordValid] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    //otwiera mi się drugie okienko jak zrobić, żeby był w jednym? - nie da się
    const onRegisterClicked = useCallback(async () => {
        try {
            // const pageLocation: string[] = window.location.pathname.split("/");
            // const pathVariable: string = pageLocation[pageLocation.length - 1];
            // zmieniłem na useParams ale nie było przetestowane

            await AuthApi.resetPassword({ password: password }, resetToken!);
            // await AuthApi.resetPassword({ password: password }, pathVariable);

            toast.success("Your password has successfully been reset, close the window and log in", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 4000,
            });
        } catch (error: any) {
            let message: string;

            if (error.response && error.response.status === 404) {
                message = error.response.data + ", your link seems incorrect";
            } else if (error.response.status === 403) {
                message = error.response.data;
            } else {
                message = "An error occured when trying to connect to server";
            }
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, [password, resetToken]);

    useEffect(() => {
        setIsPasswordValid(password.length > 0);
    }, [password]);

    useEffect(() => {
        setIsRepeatedPasswordValid(password.length > 0 && password === repeatedPassword);
    }, [repeatedPassword, password]);

    return (
        <div>
            <LoginPageContainer>
                <LoginBrandingContainer>
                    <LoginIdeasIcon />
                </LoginBrandingContainer>
                <LoginContainer>
                    <LoginInputContainer>
                        <DivWrapper>
                            <LoginInput
                                placeholder="New password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setPassword(e.currentTarget.value)}
                            />
                            <CheckboxContainer
                                style={{ justifyContent: !isPasswordValid ? "space-between" : "flex-end" }}
                            >
                                {!isPasswordValid && (
                                    <ValidationError>Please provide your new password</ValidationError>
                                )}
                                <label>
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={() => setShowPassword(!showPassword)}
                                    />
                                    Show password?
                                </label>
                            </CheckboxContainer>
                        </DivWrapper>
                        <DivWrapper>
                            <LoginInput
                                placeholder="Repeat password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setRepeatedPassword(e.currentTarget.value)}
                            />
                            {!isRepeatedPasswordValid && <ValidationError>Please repeat password</ValidationError>}
                        </DivWrapper>
                        <DivWrapper style={{ alignItems: "center" }}>
                            <LoginButton
                                disabled={!(isPasswordValid && isRepeatedPasswordValid)}
                                onClick={onRegisterClicked}
                            >
                                Confirm change
                            </LoginButton>
                            {/* <LoginLinkContainer>
                                <LoginLink to={"/login"}>
                                    <LoginLinkSpan>Already have an account?</LoginLinkSpan> Log in
                                </LoginLink>
                            </LoginLinkContainer> */}
                        </DivWrapper>
                    </LoginInputContainer>
                </LoginContainer>
            </LoginPageContainer>
        </div>
    );
};
