import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Thread } from "../../models/thread/Thread";
import { Box, Button, Typography } from "@mui/material";
import { UserContext } from "../../context/UserContext";
// import { Loader, LoaderContainer } from "../../router/App.styles";
import { ContentsContainer, MainContainer } from "./CommentComponent.styles";
import { CommentApi } from "../../api/CommentApi";
import { TextInput } from "./TextInput";
import { CommentCreateDTO } from "../../models/thread/CommentCreateDTO";
import { Comment } from "../../models/Comment";

interface CommentComponentProps {
    thread: Thread;
}

export const CommentComponent = ({ thread }: CommentComponentProps) => {
    const { currentUser } = useContext(UserContext);
    const [comments, setComments] = useState<Comment[]>(thread?.comments);
    // const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
    const [commentRequest, setCommentRequest] = useState<CommentCreateDTO>({
        commentText: "",
        userId: 0,
        threadId: thread?.threadId,
    });

    useEffect(() => {
        // console.log("thread?.status.statusId", thread?.status?.statusId);
        if (currentUser) {
            setCommentRequest((prevState) => ({ ...prevState, userId: currentUser.user_id }));
        }
    }, [currentUser]);

    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldName in commentRequest) {
            setCommentRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    const handleDeleteCommentClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, commentId: number) => {
        try {
            const newUserComments = comments.filter((comment) => comment.commentId !== commentId);
            setComments(newUserComments);
            CommentApi.deleteCommentById(commentId);
        } catch (error: any) {
            toast.error("An error occured when trying to connect to server", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const handleAddCommentClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            const response = await CommentApi.addComment(commentRequest);
            const newComment: Comment = response.data;
            setComments((prevState) => [...prevState, newComment]);
            handleFieldChange("commentText", "");
        } catch (error: any) {
            toast.error("An error occured when trying to connect to server", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    useEffect(() => {
        const isValid: boolean =
            commentRequest.commentText.length > 0 && commentRequest.userId > 0 && commentRequest.threadId > 0;
        setIsRequestValid(isValid);
    }, [commentRequest]);

    return (
        <MainContainer>
            <ContentsContainer>
                {thread?.stage.stageId > 1 && (
                    <ContentsContainer>
                        <Typography width="100%" fontWeight="bold" variant="h5">
                            Comments{" "}
                            <span
                                style={{
                                    fontWeight: "normal",
                                    fontFamily: "inherit",
                                }}
                            >
                                ({comments?.length ? comments.length : 0})
                            </span>
                        </Typography>
                        {comments?.map((comment) => (
                            <Box width="100%" key={comment.commentId} marginBottom={2}>
                                <Typography fontWeight="bold" variant="subtitle1">
                                    {comment.commentAuthorName}
                                    <span
                                        style={{
                                            fontWeight: "normal",
                                            fontFamily: "inherit",
                                            fontSize: "80%",
                                            marginLeft: "16px",
                                        }}
                                    >
                                        {new Date(comment.commentDate).toLocaleDateString()}
                                    </span>
                                </Typography>
                                <Typography marginBottom={1} width="100%" fontWeight="bold" variant="subtitle2">
                                    {comment.commentAuthorDepartment}
                                </Typography>
                                <Typography
                                    marginBottom={1}
                                    sx={{
                                        wordWrap: "break-word",
                                        overflowWrap: "break-word",
                                    }}
                                >
                                    {comment.commentText}
                                </Typography>

                                {(currentUser?.user_id === comment.commentAuthorId ||
                                    currentUser?.role === "Admin") && (
                                    <Button
                                        variant="outlined"
                                        color="secondary"
                                        onClick={(e) => handleDeleteCommentClick(e, comment.commentId)}
                                        sx={{ width: "200px", borderRadius: "30px" }}
                                        size="small"
                                    >
                                        Remove comment
                                    </Button>
                                )}
                            </Box>
                        ))}
                    </ContentsContainer>
                )}
                {thread?.stage.stageId === 2 && (
                    <Box width={"100%"} marginBottom={4}>
                        <TextInput
                            id={"comment-input"}
                            label={"Add your comment"}
                            fieldName={"commentText"}
                            value={commentRequest.commentText}
                            handleFieldChange={handleFieldChange}
                            maxLength={100}
                            readOnly={false}
                        ></TextInput>
                        <Button
                            variant="contained"
                            color="secondary"
                            disabled={!isRequestValid}
                            onClick={(e) => handleAddCommentClick(e)}
                            sx={{ width: "100%", borderRadius: "30px" }}
                        >
                            Send
                        </Button>
                    </Box>
                )}
            </ContentsContainer>
        </MainContainer>
    );
};
