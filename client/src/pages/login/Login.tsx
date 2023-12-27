import { useCallback, useContext, useEffect, useState } from "react";
import {
    CheckboxContainer,
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
import { UserContext } from "../../context/UserContext";
import jwtDecode from "jwt-decode";
import { UserFromToken } from "../../models/UserFormToken";
import { SignInRequest } from "../../models/api/SignInRequest";
import { validateEmailRFC2822 } from "./LoginHelpers";
import { saveTokensToLocaleStorage } from "../../auth_helpers/authHelpers";

export const Login = () => {
    const navigate = useNavigate();
    const { userModifier } = useContext(UserContext);

    const [signInRequest, setSignInRequest] = useState<SignInRequest>({ email: "", password: "" });

    const [isEmailValid, setIsEmailValid] = useState<boolean>(true);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);

    const onLoginClicked = useCallback(async () => {
        try {
            const result = await AuthApi.signIn(signInRequest);

            saveTokensToLocaleStorage(result.data);

            toast.success("You have successfully signed in", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });

            const decodedAccessToken: UserFromToken = jwtDecode(result.data.access_token);

            // userModifier({user_id: number, name: string, role: string, sub: string, exp: number;});
            // userModifier({
            //     user_id: decodedAccessToken.user_id,
            //     name: decodedAccessToken.name,
            //     role: decodedAccessToken.role,
            //     sub: decodedAccessToken.sub,
            //     exp: decodedAccessToken.exp
            // });
            userModifier({ ...decodedAccessToken });

            navigate("/");
        } catch (error: any) {
            let message: string;

            if (error.response && error.response.status === 403) {
                message = "Incorrect email or password";
            } else {
                message = "An error occured when trying to connect to server";
            }
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, [signInRequest, navigate, userModifier]);

    //czy tutaj powinno używać się useCallback?
    const onEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInRequest({ ...signInRequest, email: e.currentTarget.value });
    };

    const onPasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSignInRequest({ ...signInRequest, password: e.currentTarget.value });
    };

    const onShowPasswordClick = useCallback(() => {
        setShowPassword(!showPassword);
    }, [showPassword]);

    useEffect(() => {
        setIsEmailValid(validateEmailRFC2822(signInRequest.email));
    }, [signInRequest.email]);

    useEffect(() => {
        setIsPasswordValid(signInRequest.password.length > 0);
    }, [signInRequest.password]);

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
                        <DivWrapper>
                            <LoginInput
                                placeholder="Password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => onPasswordChange(e)}
                            />
                            <CheckboxContainer
                                style={{ justifyContent: !isPasswordValid ? "space-between" : "flex-end" }}
                            >
                                {!isPasswordValid && <ValidationError>Please provide password</ValidationError>}
                                <label>
                                    <input type="checkbox" checked={showPassword} onChange={onShowPasswordClick} />
                                    Show password?
                                </label>
                            </CheckboxContainer>
                        </DivWrapper>
                        <LoginButtonContainer>
                        <LoginButton disabled={!isEmailValid || !isPasswordValid} onClick={onLoginClicked}>
                            Sign in
                        </LoginButton>
                        <LoginLinkContainer>
                            <LoginLink to={"/forgot-password"}>
                                <LoginLinkSpan>Forgot</LoginLinkSpan> Password
                            </LoginLink>
                            <LoginLink to={"/register"}>
                                <LoginLinkSpan>Don't have an account?</LoginLinkSpan> Sign up
                            </LoginLink>
                            <LoginLink to={"/change-password"}>
                                <LoginLinkSpan>Want to</LoginLinkSpan> Change password
                            </LoginLink>
                        </LoginLinkContainer>
                    </LoginButtonContainer>
                    </LoginInputContainer>
                    
                </LoginContainer>
            </LoginPageContainer>
        </div>
    );
};
