import { Box, Button, MenuItem, Paper, Stack, TextField } from "@mui/material";
import { ContentsContainer, MainContainer, OrangeStripe } from "./Users.styles";
// import { useNavigate } from "react-router-dom";
import { UserDataContainer } from "./AddUser.styles";
import { TextInput } from "../../components/thread/TextInput";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { Role } from "../../models/Role";
import { Department } from "../../models/Department";
import { RoleApi } from "../../api/RoleApi";
import { DepartmentApi } from "../../api/DepartmentApi";
import { toast } from "react-toastify";
import { RegisterRequest } from "../../models/api/RegisterRequest";
import { validateEmailRFC2822 } from "../login/LoginHelpers";
import { AuthApi } from "../../api/AuthApi";

export const AddUser = () => {
    // const navigate = useNavigate();
    const { currentUser } = useContext(UserContext);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [departments, setDepartments] = useState<Department[] | null>(null);
    const [showAddButton, setShowAddButton] = useState<boolean>(false);

    const [repeatedPassword, setRepeatedPassword] = useState<string>("");
    const [isRepeatedPasswordClicked, setIsRepeatedPasswordClicked] = useState<boolean>(false);
    const [isRegisterRequestValid, setIsRegisteredRequestValid] = useState<boolean>(false);
    const [registerRequest, setRegisterRequest] = useState<RegisterRequest>({
        name: "",
        email: "",
        password: "",
        roleId: 0,
        departmentId: 0,
    });

    const getRolesAndDepartments = useCallback(async () => {
        try {
            const [responseRoles, responseDepartments] = await Promise.all([
                RoleApi.getAllRoles(),
                DepartmentApi.getAllDepartments(),
            ]);
            setRoles([...responseRoles.data]);
            setDepartments([...responseDepartments.data]);
        } catch (error: any) {
            toast.error("An error occured when trying to connect to server", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, []);

    useEffect(() => {
        getRolesAndDepartments();
    }, [getRolesAndDepartments]);

    const registerUser = useCallback(async (registerRequest: RegisterRequest) => {
        try {
            await AuthApi.signUp(registerRequest);

            toast.success("User registration successfull", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        } catch (error: any) {
            let message: string;
            if (
                error?.response?.status === 400 &&
                error?.response?.data?.errorMessage === "email already exists in DB"
            ) {
                message = "email already exists in DB";
            } else if (error?.response?.status === 400) {
                message = "incorrect request data";
            } else {
                message = "An error occured when trying to connect to server";
            }
            toast.error(message, {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    }, []);

    useEffect(() => {
        if (currentUser) {
            setShowAddButton(currentUser?.role === "Admin");
        } else {
            setShowAddButton(false);
        }
    }, [currentUser]);

    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldName in registerRequest) {
            setRegisterRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    useEffect(() => {
        const isValid: boolean =
            !!registerRequest.name &&
            validateEmailRFC2822(registerRequest.email) &&
            !!registerRequest.password &&
            registerRequest.password === repeatedPassword &&
            !!registerRequest.roleId &&
            !!registerRequest.departmentId;

        setIsRegisteredRequestValid(isValid);
    }, [registerRequest, repeatedPassword]);

    const resetForm = () => {
        setRegisterRequest({
            name: "",
            email: "",
            password: "",
            roleId: 0,
            departmentId: 0,
        });
        setRepeatedPassword("");
    };

    const onResetClick = () => {
        resetForm();
    };

    const onSaveClick = () => {
        registerUser(registerRequest);
        resetForm();
    };

    return (
        <MainContainer>
            <OrangeStripe />
            <ContentsContainer>
                <Paper
                    elevation={4}
                    sx={{
                        minHeight: "75vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        left: "0",
                        right: "0",
                        margin: "0 auto",
                        marginBottom: "32px",
                        position: "relative",
                    }}
                    style={{ width: "100%" }}
                >
                    <UserDataContainer>
                        <Box minHeight={80} width="100%">
                            <TextInput
                                id={"register-user-name-input"}
                                label={"Name"}
                                fieldName={"name"}
                                value={registerRequest.name}
                                handleFieldChange={handleFieldChange}
                                maxLength={40}
                                readOnly={false}
                            />
                        </Box>
                        <Box minHeight={80} width="100%">
                            <TextInput
                                id={"register-user-email-input"}
                                label={"E-mail"}
                                fieldName={"email"}
                                value={registerRequest.email}
                                handleFieldChange={handleFieldChange}
                                maxLength={40}
                                readOnly={false}
                            />
                        </Box>
                        <Box minHeight={80} width="100%">
                            <TextInput
                                id={"register-user-password"}
                                label={"Password"}
                                fieldName={"password"}
                                value={registerRequest.password}
                                handleFieldChange={handleFieldChange}
                                maxLength={40}
                                readOnly={false}
                            />
                        </Box>
                        <Box minHeight={80} width="100%">
                            <TextField
                                id={"register-user-repeated-password"}
                                fullWidth
                                label={"Repeat password"}
                                variant="standard"
                                color="secondary"
                                multiline
                                value={repeatedPassword}
                                error={!repeatedPassword && isRepeatedPasswordClicked}
                                onFocus={(e) => setIsRepeatedPasswordClicked(true)}
                                onBlur={(e) => setIsRepeatedPasswordClicked(false)}
                                onChange={(e) => {
                                    if (e.target.value.length < 40) {
                                        setRepeatedPassword(e.target.value);
                                    }
                                }}
                                inputProps={{
                                    maxLength: 40, // Set the maximum number of characters
                                    readOnly: false,
                                }}
                                helperText={
                                    !repeatedPassword
                                        ? `Required`
                                        : repeatedPassword === registerRequest.password
                                        ? `${repeatedPassword.length}/40 characters`
                                        : `${repeatedPassword.length}/40 characters. Passwords should match`
                                }
                            />
                        </Box>
                        <Box minHeight={80} width="100%">
                            {roles && (
                                <TextField
                                    color="secondary"
                                    label={registerRequest.roleId ? "Role" : ""}
                                    variant="standard"
                                    select
                                    value={registerRequest.roleId}
                                    onChange={(e) =>
                                        setRegisterRequest((prevState) => ({ ...prevState, roleId: +e.target.value }))
                                    }
                                    fullWidth
                                    inputProps={{
                                        readOnly: false,
                                    }}
                                >
                                    <MenuItem value={0} disabled={false}>
                                        {"Select role"}
                                    </MenuItem>
                                    {roles.map((role, index) => (
                                        <MenuItem key={index} value={role.roleId}>
                                            {role.roleName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </Box>
                        <Box minHeight={80} width="100%" marginBottom={"32px"}>
                            {departments && (
                                <TextField
                                    color="secondary"
                                    label={registerRequest.roleId ? "Department" : ""}
                                    variant="standard"
                                    select
                                    value={registerRequest.departmentId}
                                    onChange={(e) =>
                                        setRegisterRequest((prevState) => ({
                                            ...prevState,
                                            departmentId: +e.target.value,
                                        }))
                                    }
                                    fullWidth
                                    inputProps={{
                                        readOnly: false,
                                    }}
                                >
                                    <MenuItem value={0} disabled={false}>
                                        {"Select department"}
                                    </MenuItem>
                                    {departments.map((department, index) => (
                                        <MenuItem key={index} value={department.departmentId}>
                                            {department.departmentName}
                                        </MenuItem>
                                    ))}
                                </TextField>
                            )}
                        </Box>
                    </UserDataContainer>
                    {showAddButton && (
                        <Stack direction={"row"} spacing={3}>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onSaveClick}
                                disabled={!isRegisterRequestValid}
                                sx={{ width: "120px" }}
                            >
                                Add
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onResetClick}
                                disabled={
                                    !registerRequest.name &&
                                    !registerRequest.email &&
                                    !registerRequest.password &&
                                    !registerRequest.roleId &&
                                    !registerRequest.departmentId &&
                                    !repeatedPassword
                                }
                                sx={{ width: "120px" }}
                            >
                                Reset
                            </Button>
                        </Stack>
                    )}
                </Paper>
            </ContentsContainer>
        </MainContainer>
    );
};
