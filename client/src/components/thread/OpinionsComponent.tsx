import { useEffect, useState, useContext } from "react";
import { toast } from "react-toastify";
import { Thread } from "../../models/thread/Thread";
import { Box, MenuItem, TextField } from "@mui/material";
import { UserContext } from "../../context/UserContext";
import { Loader, LoaderContainer } from "../../router/App.styles";

import { StageApi } from "../../api/StageApi";
import { Stage } from "../../models/Stage";
import { AdmissionComponent } from "./AdmissionComponent";
import { ConclusionComponent } from "./ConclusionComponent";
import { ContentsContainer, MainContainer } from "./OpinionsComponent.styles";

interface OpinionComponentProps {
    thread: Thread;
    getThreadById: (threadId: number) => Promise<void>;
    setThread: React.Dispatch<React.SetStateAction<Thread | undefined>>;
}

export const OpinionsComponent = ({ thread, getThreadById, setThread }: OpinionComponentProps) => {
    const { currentUser } = useContext(UserContext);
    const [editAdmission, setEditAdmission] = useState<boolean>(false);
    const [editConclusion, setEditConclusion] = useState<boolean>(false);

    const [stages, setStages] = useState<Stage[]>([]);
    const [stageId, setStageId] = useState<number>(0);

    useEffect(() => {
        const result: Stage | undefined = stages.find((stage) => stage.stageId === thread?.stage.stageId);
        if (result) {
            setStageId(result.stageId);
        }
    }, [stages, thread]);

    useEffect(() => {
        const getStages = async () => {
            try {
                const response = await StageApi.getAllStages();
                setStages(response.data);
            } catch (error: any) {
                toast.error("An error occured when trying to connect to server", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            }
        };

        getStages();
    }, []);

    if (!currentUser) {
        return (
            <LoaderContainer>
                <Loader />
            </LoaderContainer>
        );
    }

    return (
        <MainContainer>
            <ContentsContainer>
                {stageId && (
                    <Box width="100%" marginBottom={"48px"}>
                        <TextField
                            color="secondary"
                            label="Stage"
                            variant="standard"
                            select
                            value={stageId}
                            onChange={(e) => setStageId(+e.target.value)}
                            fullWidth
                            error={editAdmission || editConclusion}
                            inputProps={{
                                readOnly: !(editAdmission || editConclusion),
                            }}
                            helperText={!(editAdmission || editConclusion) ? "" : "Select stage"}
                        >
                            {stages.map((stage, index) => (
                                <MenuItem
                                    key={index}
                                    value={stage.stageId}
                                    disabled={
                                        (editAdmission && (stage.stageId > 3 || stage.stageId === 1)) ||
                                        (editConclusion && stage.stageId <= 3)
                                    }
                                >
                                    {stage.stageName}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                )}
                <AdmissionComponent
                    thread={thread}
                    setThread={setThread}
                    // getThreadById={getThreadById}
                    stageId={stageId}
                    setStageId={setStageId}
                    edit={editAdmission}
                    setEdit={setEditAdmission}
                    isConclusionEdited={editConclusion}
                />
                <ConclusionComponent
                    thread={thread}
                    setThread={setThread}
                    // getThreadById={getThreadById}
                    stageId={stageId}
                    setStageId={setStageId}
                    edit={editConclusion}
                    setEdit={setEditConclusion}
                    isAdmissionEdited={editAdmission}
                />
            </ContentsContainer>
        </MainContainer>
    );
};
