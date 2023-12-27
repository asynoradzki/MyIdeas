import { Button, Stack } from "@mui/material";
import { User } from "../../models/User";
import { useCallback, useContext, useEffect, useState } from "react";
import { UserContext } from "../../context/UserContext";
import { toast } from "react-toastify";
import { UserApi } from "../../api/UserApi";

interface DeleteUserProps {
    onSelectedUser: (user: User | null) => void;
    selectedUser: User | null;
}

export const DeleteUser = ({ selectedUser, onSelectedUser }: DeleteUserProps) => {
    const [deleteButtonState, setDeleteButtonState] = useState<"delete" | "confirm">("delete");
    const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
    const { currentUser } = useContext(UserContext);

    useEffect(() => {
        setShowDeleteButton(false);
        if (currentUser && selectedUser) {
            setShowDeleteButton(currentUser?.role === "Admin");
        }
    }, [currentUser, selectedUser]);

    const deleteUserById = useCallback(
        async (userId: number) => {
            try {
                await UserApi.deleteUserById(userId);
                onSelectedUser(null);

                toast.success(`User nr: ${userId} has been deleted`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            } catch (error: any) {
                toast.error("An error occured when trying to connect to server", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            }
        },
        [onSelectedUser]
    );

    const onDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        deleteButtonState === "delete" ? setDeleteButtonState("confirm") : deleteUserById(selectedUser?.userId!);
    };

    const onCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDeleteButtonState("delete");
    };
    return (
        <div>
            {showDeleteButton && (
                <Stack margin={"32px 0"} direction={"row"} spacing={2}>
                    <Button
                        variant="outlined"
                        color={deleteButtonState === "delete" ? "error" : "error"}
                        onClick={onDeleteButtonClick}
                        sx={{ width: "140px" }}
                    >
                        {deleteButtonState === "delete" ? "Delete user" : "Confirm"}
                    </Button>
                    {deleteButtonState === "confirm" && (
                        <Button
                            variant="outlined"
                            color="secondary"
                            onClick={onCancelButtonClick}
                            sx={{ width: "140px" }}
                        >
                            Cancel
                        </Button>
                    )}
                </Stack>
            )}
        </div>
    );
};
