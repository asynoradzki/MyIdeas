import { useEffect, useState, useContext } from "react";
import { ThreadApi } from "../../api/ThreadApi";
import { toast } from "react-toastify";
import { Thread } from "../../models/thread/Thread";
import { Button } from "@mui/material";
import {
    ButtonsContainer,
    InnerContainer,
    MainContainer,
    PhotoContainer,
    InfoContainer,
    ContentsContainer,
    VoteContainer,
} from "./ThreadComponent.styles";
import { TextInput } from "./TextInput";
import { UserContext } from "../../context/UserContext";
import { Photo } from "./Photo";
import { ThreadUpdateDTO } from "../../models/thread/ThreadUpdateDTO";
import { defaultImage } from "../../constants/constants";
import { useParams } from "react-router-dom";
import { ImageUrl } from "../../models/thread/ImageUrl";
import { ImageFile } from "../../models/thread/ImageFile";
import { CategoryApi } from "../../api/CategoryApi";
import { Category } from "../../models/Category";
import { SelectInput } from "./SelectInput";
import { AutocompleteObject } from "../../models/thread/AutocompleteObject";
import { VoteComponent } from "./VoteComponent";

interface ThreadComponentProps {
    thread: Thread;
    setThread: React.Dispatch<React.SetStateAction<Thread | undefined>>;
}

export const ThreadComponent = ({ thread, setThread }: ThreadComponentProps) => {
    const { id } = useParams();
    const { currentUser } = useContext(UserContext);
    const [showEdit, setShowEdit] = useState<boolean>(false);
    const [edit, setEdit] = useState<boolean>(false);
    const [updateRequest, setUpdateRequest] = useState<ThreadUpdateDTO>({
        email: "",
        title: thread?.title,
        description: thread?.description,
        justification: thread?.justification,
        points: thread?.points,
        categoryId: thread?.category.categoryId,
        stageId: thread?.stage.stageId,
        statusId: thread?.status.statusId,
    });
    const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [imageUrl, setImageUrl] = useState<ImageUrl>({ current: defaultImage, previous: defaultImage });
    const [imageFile, setImageFile] = useState<ImageFile>({ current: null, previous: null });
    const [autocompleteValue, setAutocompleteValue] = useState<AutocompleteObject | null>(null);

    useEffect(() => {
        if (currentUser) {
            setShowEdit(currentUser?.sub === thread?.user?.email || currentUser?.role === "Admin");
            setUpdateRequest((prevState) => {
                return { ...prevState, email: currentUser.sub };
            });
        }
    }, [currentUser, thread]);

    useEffect(() => {
        const getCategories = async () => {
            const response = await CategoryApi.getAllCategories();
            setCategories(response.data);
        };

        getCategories();
    }, []);

    const onEditClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(true);
        setImageFile((prevState) => ({ ...prevState, current: null }));
    };

    const onCancelClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setEdit(false);
        setUpdateRequest({
            ...updateRequest,
            title: thread?.title,
            description: thread?.description,
            justification: thread?.justification,
            points: thread?.points,
            categoryId: thread?.category.categoryId,
            stageId: thread?.stage.stageId,
            statusId: thread?.status.statusId,
        });
        setImageUrl({ ...imageUrl, current: imageUrl.previous });
        setImageFile({ ...imageFile, current: imageFile.previous });
    };

    const onSaveClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            const response = await ThreadApi.updateThreadById(+id!, imageFile.current, updateRequest);
            setThread(response.data);
            setImageUrl({ ...imageUrl, previous: imageUrl.current });
            setImageFile({ ...imageFile, previous: imageFile.current });
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                console.error("incorrect data for thread update");
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
        if (fieldName in updateRequest) {
            setUpdateRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    useEffect(() => {
        const isValid: boolean =
            updateRequest.email &&
            updateRequest.title &&
            updateRequest.description &&
            updateRequest.justification &&
            updateRequest.categoryId
                ? true
                : false;
        setIsRequestValid(isValid);
    }, [updateRequest]);

    useEffect(() => {
        const result = categories.find((category) => category.categoryId === updateRequest.categoryId);
        const value: AutocompleteObject | null = result ? { id: result.categoryId, label: result.categoryName } : null;
        setAutocompleteValue(value);
    }, [updateRequest.categoryId, categories]);

    return (
        <MainContainer>
            <ContentsContainer>
                <InnerContainer>
                    <VoteContainer>
                        <VoteComponent thread={thread!} />
                    </VoteContainer>
                    <PhotoContainer>
                        <Photo
                            photo={thread?.photo}
                            readOnly={!edit}
                            imageUrl={imageUrl}
                            setImageUrl={setImageUrl}
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                        />
                    </PhotoContainer>
                    <InfoContainer>
                        <TextInput
                            id={"title-input"}
                            label={"Title"}
                            fieldName={"title"}
                            value={updateRequest.title}
                            handleFieldChange={handleFieldChange}
                            maxLength={40}
                            readOnly={!edit}
                        />

                        <TextInput
                            id={"description-input"}
                            label={"Description"}
                            fieldName={"description"}
                            value={updateRequest.description}
                            handleFieldChange={handleFieldChange}
                            maxLength={200}
                            readOnly={!edit}
                        />

                        <TextInput
                            id={"justification-input"}
                            label={"Justification"}
                            fieldName={"justification"}
                            value={updateRequest.justification}
                            handleFieldChange={handleFieldChange}
                            maxLength={200}
                            readOnly={!edit}
                        />

                        <SelectInput
                            fieldName="categoryId"
                            label="Category"
                            initialValue={autocompleteValue}
                            options={categories.map((category) => ({
                                id: category.categoryId,
                                label: category.categoryName,
                            }))}
                            handleFieldChange={handleFieldChange}
                            readOnly={!edit}
                        />
                    </InfoContainer>
                </InnerContainer>

                {showEdit && (
                    <ButtonsContainer>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={!edit ? onEditClick : onSaveClick}
                            disabled={!isRequestValid}
                            sx={{ width: "120px" }}
                        >
                            {!edit ? "Edit" : "Save"}
                        </Button>
                        {edit && (
                            <Button
                                variant="contained"
                                color="secondary"
                                onClick={onCancelClick}
                                sx={{ width: "120px" }}
                            >
                                {"Cancel"}
                            </Button>
                        )}
                    </ButtonsContainer>
                )}
            </ContentsContainer>
        </MainContainer>
    );
};
