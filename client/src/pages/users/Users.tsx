import { useContext, useEffect, useState } from "react";
import { User } from "../../models/User";
import { SearchUser } from "../../components/user/SearchUser";
import { ContentsContainer, MainContainer, OrangeStripe } from "./Users.styles";
import { Button, Paper } from "@mui/material";
import { EditUser } from "../../components/user/EditUser";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";
// import { DeleteUser } from "../../components/user/DeleteUser";

export const Users = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [showAddButton, setShowAddButton] = useState<boolean>(false);

    useEffect(() => {
        if (currentUser) {
            setShowAddButton(currentUser?.role === "Admin");
        } else {
            setShowAddButton(false);
        }
    }, [currentUser]);

    const onSelectedUser = (selectedUser: User | null) => {
        setSelectedUser(selectedUser);
    };

    // console.log("selectedUser1: ", selectedUser);

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
                    {showAddButton && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={() => navigate("/addUser")}
                            sx={{ width: "120px", position: "absolute", top: "30px" }}
                        >
                            add user
                        </Button>
                    )}
                    <SearchUser selectedUser={selectedUser} onSelectedUser={onSelectedUser} />
                    <EditUser selectedUser={selectedUser} onSelectedUser={onSelectedUser} />
                    {/* <DeleteUser selectedUser={selectedUser} onSelectedUser={onSelectedUser} /> */}
                </Paper>
            </ContentsContainer>
        </MainContainer>
    );
};
