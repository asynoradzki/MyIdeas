import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Thread } from "../../models/thread/Thread";
import { Box, Button } from "@mui/material";
import { TextInput } from "./TextInput";
import { UserContext } from "../../context/UserContext";

import { AdmissionCreateDTO } from "../../models/thread/AdmissionCreateDTO";
import { AdmissionApi } from "../../api/AdmissionApi";
import { UserApi } from "../../api/UserApi";
import { ButtonsContainer, ContentsContainer, InfoContainer, MainContainer } from "./AdmissionComponent.styles";

interface AdmissionComponentProps {
    thread: Thread;
    setThread: React.Dispatch<React.SetStateAction<Thread | undefined>>;
    stageId: number;
    setStageId: React.Dispatch<React.SetStateAction<number>>;
    edit: boolean;
    setEdit: React.Dispatch<React.SetStateAction<boolean>>;
    isConclusionEdited: boolean;
}

export const AdmissionComponent = ({
    thread,
    setThread,
    stageId,
    setStageId,
    edit,
    setEdit,
    isConclusionEdited,
}: AdmissionComponentProps) => {
    const { currentUser } = useContext(UserContext);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [admissionRequest, setAdmissionRequest] = useState<AdmissionCreateDTO>({
        content: thread?.admission ? thread?.admission?.content : "",
        userId: 0,
        threadId: thread?.threadId,
        stageId: stageId,
    });

    const [isAdmissionRequestValid, setIsAdmissionRequestValid] = useState<boolean>(false);
    const [author, setAuthor] = useState<string>("");

    useEffect(() => {
        setAdmissionRequest({ ...admissionRequest, stageId: stageId });
        // ta wartość ma być wczytywana tylko jeśli użytkownik zmienia stage w OpinionsComponent
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stageId]);

    useEffect(() => {
        setShowEdit(false);
        if (currentUser && thread?.stage.stageId < 4) {
            setShowEdit(currentUser?.role === "Admin");
            setAdmissionRequest((prevState) => ({ ...prevState, userId: currentUser?.user_id }));
        }
    }, [currentUser, thread]);

    useEffect(() => {
        const getAuthor = async () => {
            if (thread?.admission) {
                try {
                    const response = await UserApi.getUserById(thread?.admission?.userId);
                    setAuthor(response.data.email);
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
            }
        };
        getAuthor();
    }, [thread]);

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(false);
        setAdmissionRequest({
            ...admissionRequest,
            content: thread.admission ? thread.admission.content : "",
            stageId: thread.stage.stageId,
        });
        setStageId(thread.stage.stageId);
    };

    const onSaveClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            if (!thread?.admission) {
                const response = await AdmissionApi.addAdmission(admissionRequest);
                setThread({
                    ...thread,
                    admission: response.data,
                    stage: { ...thread.stage, stageId: +admissionRequest.stageId },
                });
            } else {
                const response = await AdmissionApi.updateAdmissionById(thread.admission.admissionId, {
                    content: admissionRequest.content,
                    userId: +admissionRequest.userId,
                    stageId: +admissionRequest.stageId,
                });
                setThread({
                    ...thread,
                    admission: response.data,
                    stage: { ...thread.stage, stageId: +admissionRequest.stageId },
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
        if (fieldName in admissionRequest) {
            setAdmissionRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    useEffect(() => {
        const isValid: boolean =
            admissionRequest.content &&
            admissionRequest.stageId > 1 &&
            admissionRequest.threadId &&
            admissionRequest.userId
                ? true
                : false;
        setIsAdmissionRequestValid(isValid);
    }, [admissionRequest]);

    return (
        <MainContainer style={{ marginBottom: "40px", gap: "0" }}>
            {(thread?.admission || edit) && (
                <ContentsContainer>
                    <InfoContainer>
                        <div>Reviewed on</div>
                        <div>
                            {thread?.admission
                                ? new Date(thread?.admission?.dateOfPost).toLocaleDateString()
                                : new Date().toLocaleDateString()}
                        </div>
                        <div>by {thread?.conclusion ? author : currentUser?.sub}</div>
                    </InfoContainer>
                    <div style={{ width: "100%" }}>
                        <TextInput
                            id={"admission-input"}
                            label={"Review"}
                            fieldName={"content"}
                            value={admissionRequest.content}
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
                            disabled={isConclusionEdited}
                            sx={{ width: "120px" }}
                        >
                            {thread?.admission ? "Edit" : "Review"}
                        </Button>
                    )}
                    {edit && (
                        <ButtonsContainer>
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onSaveClick}
                                disabled={!isAdmissionRequestValid}
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
                </Box>
            )}
        </MainContainer>
    );
};
