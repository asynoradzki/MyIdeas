import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
import jwtDecode from "jwt-decode";
import { RoleApi } from "../../api/RoleApi";
import { Role } from "../../models/Role";
import { useCallback, useContext, useEffect, useState } from "react";
import { Department } from "../../models/Department";
import { DepartmentApi } from "../../api/DepartmentApi";
import { RegisterRequest } from "../../models/api/RegisterRequest";
import { RegisterSelect } from "./Register.styles";
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
import { Loader } from "../../router/App.styles";
import { validateEmailRFC2822 } from "./LoginHelpers";
import { saveTokensToLocaleStorage } from "../../auth_helpers/authHelpers";
import ReCAPTCHA from "react-google-recaptcha";

// const siteKey = "6LewUjgpAAAAAEYRUlZnZ0mbBc2GPVXBi7Z-fqtW";
// const secretKey = "6LewUjgpAAAAANhoBZ2jq9Bp6be2CX0KwvXnmelm";

export const Register = () => {
    const navigate = useNavigate();
    const { userModifier } = useContext(UserContext);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [registerRequest, setRegisterRequest] = useState<RegisterRequest>({
        name: "",
        email: "",
        password: "",
        roleId: 0,
        departmentId: 0,
    });
    const [repeatedPassword, setRepeatedPassword] = useState<string>("");

    const [isNameValid, setIsNameValid] = useState<boolean>(false);
    const [isEmailValid, setIsEmailValid] = useState<boolean>(false);
    const [isPasswordValid, setIsPasswordValid] = useState<boolean>(false);
    const [isRepeatedPasswordValid, setIsRepeatedPasswordValid] = useState<boolean>(false);
    const [isRegisterRequestValid, setIsRegisteredRequestValid] = useState<boolean>(false);

    const [showPassword, setShowPassword] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const reCaptchaSiteKey: string | undefined = process.env.REACT_APP_RECAPTCHA_SITE_KEY;
    const [isReCaptchaValid, setIsReCaptchaValid] = useState<boolean>(false);

    const handleRecaptcha = async (value: any) => {
        if (value) {
            const response = await AuthApi.verifyRecaptcha(value);
            setIsReCaptchaValid(response.data);
            console.log("response.data", response.data);
        }
    };

    const getRolesAndDepartments = useCallback(async () => {
        try {
            setIsLoading(true);
            const [responseRoles, responseDepartments] = await Promise.all([
                RoleApi.getAllRoles(),
                DepartmentApi.getAllDepartments(),
            ]);
            setRoles([...responseRoles.data]);
            setDepartments([...responseDepartments.data]);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        getRolesAndDepartments();
    }, [getRolesAndDepartments]);

    const onRegisterClicked = useCallback(async () => {
        try {
            const result = await AuthApi.signUp(registerRequest);

            saveTokensToLocaleStorage(result.data);

            toast.success("You have successfully registered and signed in", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });

            const decodedAccessToken: UserFromToken = jwtDecode(result.data.access_token);
            userModifier({ ...decodedAccessToken });

            navigate("/");
        } catch (error: any) {
            let message: string;

            if (error.response && error.response.status === 403) {
                message = "Incorrect email or password";
            } else if (error.response.status === 400) {
                message = "User with such e-mail aready exists";
            } else {
                message = "An error occured when trying to connect to server";
            }
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, [registerRequest, navigate, userModifier]);

    useEffect(() => {
        setIsNameValid(registerRequest.name.length > 0);
    }, [registerRequest.name]);

    useEffect(() => {
        setIsEmailValid(validateEmailRFC2822(registerRequest.email));
    }, [registerRequest.email]);

    useEffect(() => {
        setIsPasswordValid(registerRequest.password.length > 0);
    }, [registerRequest.password]);

    useEffect(() => {
        setIsRepeatedPasswordValid(
            registerRequest.password.length > 0 && registerRequest.password === repeatedPassword
        );
    }, [repeatedPassword, registerRequest.password]);

    useEffect(() => {
        setIsRegisteredRequestValid(
            isNameValid &&
                isEmailValid &&
                isPasswordValid &&
                isRepeatedPasswordValid &&
                registerRequest.departmentId > 0
        );
    }, [isNameValid, isEmailValid, isPasswordValid, isRepeatedPasswordValid, registerRequest.departmentId]);

    if (isLoading) {
        return <Loader />;
    }

    return roles && departments ? (
        <div>
            <LoginPageContainer>
                <LoginBrandingContainer>
                    <LoginIdeasIcon />
                </LoginBrandingContainer>
                <LoginContainer>
                    <LoginInputContainer>
                        <DivWrapper>
                            <LoginInput
                                placeholder="name *"
                                type="text"
                                onChange={(e) =>
                                    setRegisterRequest({ ...registerRequest, name: e.currentTarget.value })
                                }
                            />
                            {!isNameValid && <ValidationError>Please provide name</ValidationError>}
                        </DivWrapper>
                        <DivWrapper>
                            <LoginInput
                                placeholder="E-mail *"
                                type="text"
                                onChange={(e) =>
                                    setRegisterRequest({ ...registerRequest, email: e.currentTarget.value })
                                }
                            />
                            {!isEmailValid && <ValidationError>Please provide e-mail</ValidationError>}
                        </DivWrapper>
                        <DivWrapper>
                            <LoginInput
                                placeholder="Password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) =>
                                    setRegisterRequest({ ...registerRequest, password: e.currentTarget.value })
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
                                placeholder="Repeat password *"
                                type={showPassword ? "text" : "password"}
                                onChange={(e) => setRepeatedPassword(e.currentTarget.value)}
                            />
                            {!isRepeatedPasswordValid && <ValidationError>Please repeat password</ValidationError>}
                        </DivWrapper>
                        <DivWrapper>
                            <RegisterSelect
                                defaultValue={0}
                                onChange={(e) => setRegisterRequest({ ...registerRequest, roleId: +e.target.value })}
                            >
                                <option value="0">choose role</option>
                                {roles.map((role, index) => (
                                    <option key={index} value={role.roleId}>
                                        {role.roleName}
                                    </option>
                                ))}
                            </RegisterSelect>
                            {!registerRequest.roleId && <ValidationError>Optional field: choose role</ValidationError>}
                        </DivWrapper>
                        <DivWrapper>
                            <RegisterSelect
                                defaultValue={0}
                                onChange={(e) =>
                                    setRegisterRequest({ ...registerRequest, departmentId: +e.target.value })
                                }
                            >
                                <option value="0">choose department *</option>
                                {departments.map((department, index) => (
                                    <option key={index} value={department.departmentId}>
                                        {department.departmentName}
                                    </option>
                                ))}
                            </RegisterSelect>
                            {!registerRequest.departmentId && <ValidationError>Choose department</ValidationError>}
                        </DivWrapper>
                        <DivWrapper style={{ alignItems: "center" }}>
                            <ReCAPTCHA sitekey={reCaptchaSiteKey!} onChange={handleRecaptcha} hl="en" />
                        </DivWrapper>

                        <DivWrapper style={{ alignItems: "center" }}>
                            <LoginButton
                                disabled={!(isRegisterRequestValid && isReCaptchaValid)}
                                onClick={onRegisterClicked}
                            >
                                Sign up
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
    ) : (
        <></>
    );
};
