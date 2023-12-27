import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Thread } from "../../models/thread/Thread";
import { Box, Button } from "@mui/material";
import { TextInput } from "./TextInput";
import { UserContext } from "../../context/UserContext";

import { UserApi } from "../../api/UserApi";
import { ButtonsContainer, ContentsContainer, InfoContainer, MainContainer } from "./AdmissionComponent.styles";
import { ConclusionCreateDTO } from "../../models/thread/ConclusionCreateDTO";
import { ConclusionApi } from "../../api/ConclusionApi";

interface ConclusionComponentProps {
    thread: Thread;
    setThread: React.Dispatch<React.SetStateAction<Thread | undefined>>;
    stageId: number;
    setStageId: React.Dispatch<React.SetStateAction<number>>;
    edit: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    isAdmissionEdited: boolean;
}

export const ConclusionComponent = ({
    thread,
    setThread,
    stageId,
    setStageId,
    edit,
    setEdit,
    isAdmissionEdited,
}: ConclusionComponentProps) => {
    const { currentUser } = useContext(UserContext);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [conclusionRequest, setConclusionRequest] = useState<ConclusionCreateDTO>({
        content: thread?.conclusion ? thread?.conclusion?.content : "",
        userId: 0,
        threadId: thread?.threadId,
        stageId: stageId,
    });

    const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
    const [author, setauthor] = useState<string>("");

    useEffect(() => {
        setConclusionRequest({ ...conclusionRequest, stageId: stageId });
        // ta wartość ma być wczytywana tylko jeśli użytkownik zmienia stage w OpinionsComponent
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageId]);

    useEffect(() => {
        setShowEdit(false);
        if (currentUser && thread?.stage.stageId > 1 && thread?.stage.stageId !== 3) {
            // todo zamienić 4 na stałą
            setShowEdit(currentUser?.role === "Admin");
            setConclusionRequest((prevState) => ({ ...prevState, userId: currentUser?.user_id }));
        }
    }, [currentUser, thread]);

    useEffect(() => {
        const getAuthor = async () => {
            try {
                if (thread?.conclusion) {
                    const response = await UserApi.getUserById(thread?.admission?.userId);
                    setauthor(response.data.email);
                }
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    console.error("incorrect data provided");
                } else {
                    toast.error("An error occured when trying to connect to server", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }
        };

        getAuthor();
    }, [thread]);

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(false);
        setConclusionRequest({
            ...conclusionRequest,
            content: thread.conclusion ? thread.conclusion.content : "",
            stageId: thread.stage.stageId,
        });
        setStageId(thread.stage.stageId);
    };

    const onSaveClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            if (!thread?.conclusion) {
                const response = await ConclusionApi.addConclusion(conclusionRequest);
                setThread({
                    ...thread,
                    conclusion: response.data,
                    stage: { ...thread.stage, stageId: +conclusionRequest.stageId },
                });
            } else {
                const response = await ConclusionApi.updateConclusionById(thread.conclusion.conclusionId, {
                    content: conclusionRequest.content,
                    userId: +conclusionRequest.userId,
                    stageId: +conclusionRequest.stageId,
                });
                setThread({
                    ...thread,
                    conclusion: response.data,
                    stage: { ...thread.stage, stageId: +conclusionRequest.stageId },
                });
            }
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                console.error("incorrect data provided");
            } else {
                toast.error("An error occured when trying to connect to server", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            }
        }
        setEdit(false);
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldName in conclusionRequest) {
            setConclusionRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    useEffect(() => {
        const isValid: boolean =
            conclusionRequest.content &&
            conclusionRequest.stageId > 3 &&
            conclusionRequest.threadId &&
            conclusionRequest.userId
                ? true
                : false;
        setIsRequestValid(isValid);
    }, [conclusionRequest]);

    return (
        <MainContainer style={{ marginBottom: "80px", gap: "0" }}>
            {(thread?.conclusion || edit) && (
                <ContentsContainer>
                    <InfoContainer>
                        <div>Evaluated on</div>
                        <div>
                            {thread?.conclusion
                                ? new Date(thread?.conclusion?.dateOfPost).toLocaleDateString()
                                : new Date().toLocaleDateString()}
                        </div>
                        <div>by {thread?.conclusion ? author : currentUser?.sub}</div>
                    </InfoContainer>
                    <div style={{ width: "100%" }}>
                        <TextInput
                            id={"conclusion-input"}
                            label={"Evaluation"}
                            fieldName={"content"}
                            value={conclusionRequest.content}
                            handleFieldChange={handleFieldChange}
                            maxLength={40}
                            readOnly={!edit}
                        />
                    </div>
                </ContentsContainer>
            )}

            {showEdit && (
                <Box>
                    {!edit && (
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={(e) => setEdit(true)}
                            disabled={isAdmissionEdited}
                            sx={{ width: "120px" }}
                        >
                            {thread?.conclusion ? "Edit" : "Evaluate"}
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
                                {"Cancel"}
                            </Button>
                        </ButtonsContainer>
                    )}
                </Box>
            )}
        </MainContainer>
    );
};
