import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import jwtDecode from "jwt-decode";
import { useCallback, useContext, useEffect, useState } from "react";
import {
    CheckboxContainer,
    DivWrapper,
    LoginBrandingContainer,
    LoginButton,
    LoginContainer,
    LoginIdeasIcon,
    LoginInput,
    LoginInputContainer,
    LoginLink,
    LoginLinkContainer,
    LoginLinkSpan,
    LoginPageContainer,
    ValidationError,
} from "./Login.styles";
import { AuthApi } from "../../api/AuthApi";
import { UserFromToken } from "../../models/UserFormToken";
import { PasswordChangeRequest } from "../../models/api/PasswordChangeRequest";
import { validateEmailRFC2822 } from "./LoginHelpers";
import { saveTokensToLocaleStorage } from "../../auth_helpers/authHelpers";

export const ChangePassword = () => {
    const navigate = useNavigate();
    const { userModifier } = useContext(UserContext);

    const [passwordChangeRequest, setPasswordChangeRequest] = useState<PasswordChangeRequest>({
        email: "",
        password: "",
        newPassword: "",
    });
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isNewPasswordValid, setIsNewPasswordValid] = useState<boolean>(false);
    const [isRepeatedPasswordValid, setIsRepeatedPasswordValid] = useState<boolean>(false);
    const [isPasswordChangeRequestValid, setIsPasswordChangeRequestValid] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onRegisterClicked = useCallback(async () => {
        try {
            const result = await AuthApi.changePassword(passwordChangeRequest);

            saveTokensToLocaleStorage(result.data);

            toast.success("Your password has successfully been changed", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });

            const decodedAccessToken: UserFromToken = jwtDecode(result.data.access_token);
            userModifier({ ...decodedAccessToken });

            navigate("/");
        } catch (error: any) {
            let message: string;

            if (error.response && error.response.status === 400) {
                message = "Incorrect email or password, new password must differ";
            } else if (error.response.status === 403) {
                message = "Incorrect email or password";
            } else {
                message = "An error occured when trying to connect to server";
            }
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, [passwordChangeRequest, navigate, userModifier]);

    useEffect(() => {
        setIsEmailValid(validateEmailRFC2822(passwordChangeRequest.email));
    }, [passwordChangeRequest.email]);

    useEffect(() => {
        setIsPasswordValid(passwordChangeRequest.password.length > 0);
    }, [passwordChangeRequest.password]);

    useEffect(() => {
        setIsNewPasswordValid(
            passwordChangeRequest.newPassword.length > 0 &&
            passwordChangeRequest.password !== passwordChangeRequest.newPassword
        );
    }, [passwordChangeRequest]);

    useEffect(() => {
        setIsRepeatedPasswordValid(
            passwordChangeRequest.newPassword.length > 0 &&
            passwordChangeRequest.newPassword === repeatedPassword &&
            passwordChangeRequest.password !== passwordChangeRequest.newPassword
        );
    }, [repeatedPassword, passwordChangeRequest]);

    useEffect(() => {
        setIsPasswordChangeRequestValid(
            isEmailValid && isPasswordValid && isNewPasswordValid && isRepeatedPasswordValid
        );
    }, [isEmailValid, isPasswordValid, isNewPasswordValid, isRepeatedPasswordValid]);

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
                                placeholder="E-mail *"
                                type="text"
                                onChange={(e) =>
                                    setPasswordChangeRequest({ ...passwordChangeRequest, email: e.currentTarget.value })
                                }
                            />
                            {!isEmailValid && <ValidationError>Please provide e-mail</ValidationError>}
                        </DivWrapper>
                        <DivWrapper>
                            <LoginInput
                                placeholder="Password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                    setPasswordChangeRequest({
                                        ...passwordChangeRequest,
                                        password: e.currentTarget.value,
                                    })
                                }
                            />
                            <CheckboxContainer
                                style={{ justifyContent: !isPasswordValid ? "space-between" : "flex-end" }}
                            >
                                {!isPasswordValid && <ValidationError>Please provide password</ValidationError>}
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
                                placeholder="New password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                    setPasswordChangeRequest({
                                        ...passwordChangeRequest,
                                        newPassword: e.currentTarget.value,
                                    })
                                }
                            />
                            {!isNewPasswordValid && <ValidationError>Please provide new password</ValidationError>}
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
                            <LoginButton disabled={!isPasswordChangeRequestValid} onClick={onRegisterClicked}>
                                Change Password
                            </LoginButton>
                            <LoginLinkContainer>
                                <LoginLink to={"/login"}>
                                    <LoginLinkSpan>Already have an account?</LoginLinkSpan> Log in
                                </LoginLink>
                            </LoginLinkContainer>
                        </DivWrapper>
                    </LoginInputContainer>
                </LoginContainer>
            </LoginPageContainer>
        </div>
    );
};
