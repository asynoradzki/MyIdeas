import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { User } from "../../models/User";
import { UserUpdateDTO } from "../../models/user/UserUpdateDTO";
import { Role } from "../../models/Role";
import { Department } from "../../models/Department";
import { RoleApi } from "../../api/RoleApi";
import { DepartmentApi } from "../../api/DepartmentApi";
import { TextInput } from "../thread/TextInput";
import { UserContext } from "../../context/UserContext";
import { Box, Button, MenuItem, TextField } from "@mui/material";
import { ButtonsContainer, UserDataContainer } from "./EditUser.styles";
import { toast } from "react-toastify";
import { UserApi } from "../../api/UserApi";
import { validateEmailRFC2822 } from "../../pages/login/LoginHelpers";

interface EditUserProps {
    selectedUser: User | null;
    onSelectedUser: (user: User | null) => void;
}

export const EditUser = ({ selectedUser, onSelectedUser }: EditUserProps) => {
    const { currentUser } = useContext(UserContext);
    const [roles, setRoles] = useState<Role[] | null>(null);
    const [departments, setDepartments] = useState<Department[] | null>(null);

    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);

    const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
    const [updateRequest, setUpdateRequest] = useState<UserUpdateDTO>({
        name: "",
        email: "",
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

    const updateUserById = useCallback(
        async (request: UserUpdateDTO) => {
            if (selectedUser) {
                try {
                    await UserApi.updateUserById(selectedUser.userId, request);
                    onSelectedUser(null);
                    setEdit(false);
                    toast.success("User data successfully updated", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                } catch (error: any) {
                    let message: string;
                    // console.log("error", error);
                    if (
                        error?.response?.status === 400 &&
                        error?.response?.data?.errorMessage === "email already exists in DB"
                    ) {
                        message = "email already exists in DB";
                    } else if (error?.response?.status === 400) {
                        message = "you have no rights to modify user data";
                    } else {
                        message = "An error occured when trying to connect to server";
                    }
                    toast.error(message, {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }
        },
        [selectedUser, onSelectedUser]
    );

    useEffect(() => {
        if (currentUser && selectedUser) {
            setShowEdit(currentUser.sub === selectedUser.email || currentUser?.role === "Admin");
        } else {
            setShowEdit(false);
        }
    }, [currentUser, selectedUser]);

    const selectedUserRoleId: number | null = useMemo(() => {
        if (selectedUser && roles) {
            const userRoleId: number | undefined = roles.find(
                (role) => role.roleName === selectedUser.roles[0].slice(5)
            )?.roleId;
            return userRoleId ? userRoleId : null;
        }
        return null;
    }, [selectedUser, roles]);

    const updateUpdateRequest = useCallback(() => {
        if (selectedUser && roles) {
            setUpdateRequest((prevState) => ({
                ...prevState,
                name: selectedUser.name,
                email: selectedUser.email,
                roleId: selectedUserRoleId ? selectedUserRoleId : 0,
                departmentId: selectedUser.department.departmentId,
            }));
        } else if (!selectedUser) {
            setUpdateRequest((prevState) => ({
                ...prevState,
                name: "",
                email: "",
                roleId: 0,
                departmentId: 0,
            }));
        }
    }, [selectedUser, roles, selectedUserRoleId]);

    useEffect(() => {
        updateUpdateRequest();
    }, [selectedUser, roles, updateUpdateRequest]);

    useEffect(() => {
        const isValid: boolean =
            (updateRequest.departmentId !== selectedUser?.department.departmentId ||
                updateRequest.email !== selectedUser?.email ||
                updateRequest.name !== selectedUser?.name ||
                updateRequest.roleId !== selectedUserRoleId) &&
            !!updateRequest.departmentId &&
            validateEmailRFC2822(updateRequest.email!) &&
            !!updateRequest.name &&
            !!updateRequest.roleId;
        setIsRequestValid(isValid);
    }, [updateRequest, selectedUserRoleId, selectedUser]);

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(false);
        updateUpdateRequest();
    };

    const onSaveClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        const request: UserUpdateDTO = {
            name: updateRequest.name !== selectedUser?.name ? updateRequest.name : null,
            email: updateRequest.email !== selectedUser?.email ? updateRequest.email : null,
            roleId: updateRequest.roleId !== selectedUserRoleId ? updateRequest.roleId : null,
            departmentId:
                updateRequest.departmentId !== selectedUser?.department.departmentId
                    ? updateRequest.departmentId
                    : null,
        };
        updateUserById(request);
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldName in updateRequest) {
            setUpdateRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    return (
        <UserDataContainer>
            <Box minHeight={80} width="100%" sx={{}}>
                <TextInput
                    id={"user-name-input"}
                    label={"Name"}
                    fieldName={"name"}
                    value={updateRequest.name}
                    handleFieldChange={handleFieldChange}
                    maxLength={40}
                    readOnly={!edit}
                />
            </Box>
            <Box minHeight={80} width="100%">
                <TextInput
                    id={"user-email-input"}
                    label={"E-mail"}
                    fieldName={"email"}
                    value={updateRequest.email}
                    handleFieldChange={handleFieldChange}
                    maxLength={40}
                    readOnly={!edit}
                />
            </Box>
            <Box minHeight={80} width="100%">
                {roles && (
                    <TextField
                        color="secondary"
                        label={updateRequest.roleId ? "Role" : ""}
                        variant="standard"
                        select
                        value={updateRequest.roleId}
                        onChange={(e) => setUpdateRequest((prevState) => ({ ...prevState, roleId: +e.target.value }))}
                        fullWidth
                        // error={edit}
                        // disabled={true}
                        inputProps={{
                            readOnly: !(edit && currentUser?.role === "Admin"),
                        }}
                        helperText={!(edit && currentUser?.role === "Admin") ? "" : "Select role"}
                    >
                        <MenuItem value={0} disabled={true}>
                            {updateRequest.roleId ? "" : "Role"}
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
                        label={updateRequest.roleId ? "Department" : ""}
                        variant="standard"
                        select
                        value={updateRequest.departmentId}
                        onChange={(e) =>
                            setUpdateRequest((prevState) => ({ ...prevState, departmentId: +e.target.value }))
                        }
                        fullWidth
                        // error={edit}
                        // disabled={true}
                        inputProps={{
                            readOnly: !edit,
                        }}
                        helperText={!edit ? "" : "Select department"}
                    >
                        <MenuItem value={0} disabled={true}>
                            {updateRequest.roleId ? "" : "Department"}
                        </MenuItem>
                        {departments.map((department, index) => (
                            <MenuItem key={index} value={department.departmentId}>
                                {department.departmentName}
                            </MenuItem>
                        ))}
                    </TextField>
                )}
            </Box>
            {showEdit && (
                <ButtonsContainer style={{ marginBottom: "48px" }}>
                    {!edit && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => setEdit(true)}
                            sx={{ width: "120px" }}
                        >
                            Edit
                        </Button>
                    )}
                    {edit && (
                        <ButtonsContainer>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onSaveClick}
                                disabled={!isRequestValid}
                                sx={{ width: "120px" }}
                            >
                                Save
                            </Button>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onCancelClick}
                                sx={{ width: "120px" }}
                            >
                                Cancel
                            </Button>
                        </ButtonsContainer>
                    )}
                </ButtonsContainer>
            )}
        </UserDataContainer>
    );
};
