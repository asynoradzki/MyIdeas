import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { Thread } from "../../models/thread/Thread";
import { UserContext } from "../../context/UserContext";
import { Vote } from "../../models/Vote";
import { IconButton, Typography } from "@mui/material";
import { VoteApi } from "../../api/VoteApi";
import { ThreadApi } from "../../api/ThreadApi";
import { VoteMain } from "./VoteComponent.styles";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import RemoveCircleOutlineIcon from "@mui/icons-material/RemoveCircleOutline";
import { toast } from "react-toastify";

interface VoteComponentProps {
    thread: Thread;
}

export const VoteComponent = ({ thread }: VoteComponentProps) => {
    const { currentUser } = useContext(UserContext);
    const [votes, setVotes] = useState<Vote[]>(thread?.votes ? thread.votes : []);
    const [points, setPoints] = useState<number>(0);
    const [plusButtonDisabled, setPlusButtonDisabled] = useState<boolean>(false);
    const [minusButtonDisabled, setMinusButtonDisabled] = useState<boolean>(false);

    //czy używać z async await czy bez co za różnica? nie ma znaczenia jesli w bloku kodu nie ma kolejnych instrukcji po await
    useEffect(() => {
        const updatePointsInThread = async (points: number) => {
            if (thread) {
                await ThreadApi.updatePointsInThreadById(thread?.threadId, points);
            }
        };

        const totalLikes: number = votes.filter((vote) => vote.voteType === "LIKE").length;
        const totalDislikes: number = votes.filter((vote) => vote.voteType === "DISLIKE").length;
        const points: number = totalLikes - totalDislikes;
        setPoints(points);

        updatePointsInThread(points);
    }, [votes, thread]);

    const deleteUserVote = useCallback(
        async (voteByCurrentUser: Vote) => {
            try {
                const newVotes: Vote[] = votes.filter((vote) => vote.id !== voteByCurrentUser.id);
                VoteApi.deleteVoteById(voteByCurrentUser.id);
                setVotes(newVotes);
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    console.error("incorrect vote data, could not find requested vote by id");
                } else {
                    toast.error("An error occured when trying to connect to server", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }
        },
        [votes]
    );

    const addUserVote = useCallback(
        async (voteType: "LIKE" | "DISLIKE") => {
            try {
                const response = await VoteApi.addVote({
                    threadId: thread?.threadId,
                    userId: currentUser?.user_id!,
                    voteType: voteType,
                });

                const newVote: Vote = response.data;
                setVotes((prevState) => [...prevState, newVote]);
            } catch (error: any) {
                if (error.response && error.response.status === 400) {
                    console.error("incorrect data, could not find thread or user by id");
                } else {
                    toast.error("An error occured when trying to connect to server", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }
        },
        [currentUser?.user_id, thread?.threadId]
    );

    const voteByCurrentUser: Vote | undefined = useMemo(
        () => votes.find((vote) => vote.userId === currentUser?.user_id),
        [votes, currentUser]
    );

    useEffect(() => {
        if (voteByCurrentUser) {
            setPlusButtonDisabled(voteByCurrentUser.voteType === "LIKE");
            setMinusButtonDisabled(voteByCurrentUser.voteType === "DISLIKE");
        } else {
            setPlusButtonDisabled(false);
            setMinusButtonDisabled(false);
        }
    }, [voteByCurrentUser]);

    const onPlusButtonClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (voteByCurrentUser && voteByCurrentUser.voteType === "DISLIKE") {
            deleteUserVote(voteByCurrentUser);
        }

        if (!voteByCurrentUser) {
            addUserVote("LIKE");
        }
    };

    const onMinusButtonClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        if (voteByCurrentUser && voteByCurrentUser.voteType === "LIKE") {
            deleteUserVote(voteByCurrentUser);
        }

        if (!voteByCurrentUser) {
            addUserVote("DISLIKE");
        }
    };

    return (
        <>
            {+thread?.stage.stageId === 2 && (
                <VoteMain>
                    <IconButton color="secondary" onClick={onPlusButtonClick} disabled={plusButtonDisabled}>
                        <AddCircleOutlineIcon fontSize="medium" />
                    </IconButton>
                    <Typography variant="h5">{points}</Typography>
                    <IconButton color="secondary" onClick={onMinusButtonClick} disabled={minusButtonDisabled}>
                        <RemoveCircleOutlineIcon fontSize="medium" />
                    </IconButton>
                </VoteMain>
            )}
        </>
    );
};
