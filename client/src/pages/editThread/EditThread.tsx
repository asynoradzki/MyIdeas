import { toast } from "react-toastify";
import { useCallback, useContext, useEffect, useState } from "react";
import { Thread } from "../../models/thread/Thread";
import { ThreadApi } from "../../api/ThreadApi";
import { useNavigate, useParams } from "react-router-dom";
import { ThreadComponent } from "../../components/thread/ThreadComponent";
import { Loader, LoaderContainer } from "../../router/App.styles";
import { OpinionsComponent } from "../../components/thread/OpinionsComponent";
import { CommentComponent } from "../../components/thread/CommentComponent";
import { Button, Paper, Stack } from "@mui/material";
import { ContentsContainer, MainContainer, OrangeStripe } from "./EditThread.styles";
import { UserContext } from "../../context/UserContext";

export const EditThread = () => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [thread, setThread] = useState<Thread>();
    const [deleteButtonState, setDeleteButtonState] = useState<"delete" | "confirm">("delete");
    const [showDeleteButton, setShowDeleteButton] = useState<boolean>(false);
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
        setShowDeleteButton(false);
        if (currentUser) {
            setShowDeleteButton(
                (currentUser?.sub === thread?.user?.email && thread.stage.stageId === 1) ||
                    currentUser?.role === "Admin"
            );
        }
    }, [currentUser, thread]);

    const getThreadById = useCallback(async (threadId: number) => {
        try {
            setIsLoading(true);
            const response = await ThreadApi.getThreadById(threadId);
            setThread(response.data);
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                toast.error("entity not found", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            } else {
                toast.error("An error occured when trying to connect to server", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            }
        } finally {
            setIsLoading(false);
        }
    }, []);

    const deleteThreadById = useCallback(
        async (threadId: number) => {
            try {
                const response = await ThreadApi.deleteThreadById(threadId);
                navigate("/");
                console.log("response.data.threadId", response.data.threadId);
                toast.success(`Idea nr: ${response.data.threadId} has been deleted`, {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    toast.error("entity not found", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                } else {
                    toast.error("An error occured when trying to connect to server", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }
        },
        [navigate]
    );

    useEffect(() => {
        if (id) {
            getThreadById(+id);
        }
    }, [getThreadById, id]);

    const onDeleteButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        deleteButtonState === "delete" ? setDeleteButtonState("confirm") : deleteThreadById(+id!);
    };

    const onCancelButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setDeleteButtonState("delete");
    };

    if (isLoading) {
        return (
            <MainContainer>
                <LoaderContainer>
                    <Loader />
                </LoaderContainer>
            </MainContainer>
        );
    }

    return (
        <MainContainer>
            <OrangeStripe />
            <ContentsContainer>
                <Paper
                    elevation={4}
                    sx={{
                        // minHeight: "60vh",
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        left: "0",
                        right: "0",
                        margin: "0 auto",
                        marginBottom: "32px",
                    }}
                    style={{ width: "100%" }}
                >
                    <ThreadComponent thread={thread!} setThread={setThread}></ThreadComponent>
                    <OpinionsComponent thread={thread!} getThreadById={getThreadById} setThread={setThread} />
                    <CommentComponent thread={thread!} />
                    {showDeleteButton && (
                        <Stack margin={"32px 0"} direction={"row"} spacing={2}>
                            <Button
                                variant="outlined"
                                color={deleteButtonState === "delete" ? "error" : "error"}
                                onClick={onDeleteButtonClick}
                                sx={{ width: "140px" }}
                            >
                                {deleteButtonState === "delete" ? "Delete idea" : "Confirm"}
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
                </Paper>
            </ContentsContainer>
        </MainContainer>
    );
};
