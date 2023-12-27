import { Paper } from "@mui/material";
import {
    ButtonsContainer,
    ContentsContainer,
    InfoContainer,
    InnerContainer,
    MainContainer,
    OrangeStripe,
    PhotoContainer,
} from "./AddThread.styles";
import { useEffect, useState, useContext } from "react";
import { ThreadApi } from "../../api/ThreadApi";
import { toast } from "react-toastify";
import { Button } from "@mui/material";
import { TextInput } from "../../components/thread/TextInput";
import { UserContext } from "../../context/UserContext";
import { Photo } from "../../components/thread/Photo";
import { defaultImage } from "../../constants/constants";
import { useNavigate } from "react-router-dom";
import { ImageUrl } from "../../models/thread/ImageUrl";
import { ImageFile } from "../../models/thread/ImageFile";
import { CategoryApi } from "../../api/CategoryApi";
import { Category } from "../../models/Category";
import { SelectInput } from "../../components/thread/SelectInput";
import { AutocompleteObject } from "../../models/thread/AutocompleteObject";
import { ThreadCreateDTO } from "../../models/thread/ThreadCreateDTO";

export const AddThread = () => {
    const { currentUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [newThreadRequest, setNewThreadRequest] = useState<ThreadCreateDTO>({
        title: "",
        description: "",
        justification: "",
        userEmail: "",
        categoryId: 0,
    });

    const [isRequestValid, setIsRequestValid] = useState<boolean>(false);
    const [categories, setCategories] = useState<Category[]>([]);

    const [imageUrl, setImageUrl] = useState<ImageUrl>({ current: defaultImage, previous: defaultImage });
    const [imageFile, setImageFile] = useState<ImageFile>({ current: null, previous: null });

    const [autocompleteValue, setAutocompleteValue] = useState<AutocompleteObject | null>(null);
    const [isResetButtonActive, setIsResetButtonActive] = useState<boolean>(false);

    useEffect(() => {
        if (currentUser) {
            setNewThreadRequest((prevState) => {
                return { ...prevState, userEmail: currentUser.sub };
            });
        }
    }, [currentUser]);

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await CategoryApi.getAllCategories();
                setCategories(response.data);
            } catch (error: any) {
                toast.error("An error occured when trying to connect to server", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            }
        };

        getCategories();
    }, []);

    const onResetClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        setNewThreadRequest({ title: "", description: "", justification: "", userEmail: "", categoryId: 0 });
        setImageUrl({ current: defaultImage, previous: defaultImage });
        setImageFile({ current: null, previous: null });
    };

    const onSaveClick = async (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        try {
            await ThreadApi.addThread(newThreadRequest, imageFile.current);
            toast.success("Your idea has been added!", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        } catch (error: any) {
            if (error.response && error.response.status === 400) {
                console.error("incorrect user e-mail");
            } else {
                toast.error("An error occured when trying to connect to server", {
                    position: toast.POSITION.TOP_RIGHT,
                    autoClose: 2000,
                });
            }
        } finally {
            navigate("/");
        }
    };

    const handleFieldChange = (fieldName: string, value: any) => {
        if (fieldName in newThreadRequest) {
            setNewThreadRequest((previous) => ({
                ...previous,
                [fieldName]: value,
            }));
        } else {
            console.error(`Invalid field name: ${fieldName}`);
        }
    };

    useEffect(() => {
        const isValid: boolean =
            !!newThreadRequest.userEmail &&
            !!newThreadRequest.title &&
            !!newThreadRequest.description &&
            !!newThreadRequest.justification &&
            !!newThreadRequest.categoryId;
        setIsRequestValid(isValid);
    }, [newThreadRequest]);

    useEffect(() => {
        const isActive: boolean =
            //Dwa znaki negazji zamieniają wyrażenie na boolean
            !!imageFile.current?.size ||
            !!newThreadRequest.title ||
            !!newThreadRequest.description ||
            !!newThreadRequest.justification ||
            !!newThreadRequest.categoryId;
        // (imageFile.current !== null && imageFile.current.size > 0) ||
        // newThreadRequest.title.length > 0 ||
        // newThreadRequest.description.length > 0 ||
        // newThreadRequest.justification.length > 0 ||
        // newThreadRequest.categoryId > 0;

        setIsResetButtonActive(isActive);
    }, [newThreadRequest, imageFile]);

    useEffect(() => {
        const result = categories.find((category) => category.categoryId === newThreadRequest.categoryId);
        const value: AutocompleteObject | null = result ? { id: result.categoryId, label: result.categoryName } : null;
        setAutocompleteValue(value);
    }, [newThreadRequest.categoryId, categories]);

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
                    <InnerContainer>
                        <PhotoContainer>
                            <Photo
                                photo={""}
                                readOnly={false}
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
                                value={newThreadRequest.title}
                                handleFieldChange={handleFieldChange}
                                maxLength={40}
                                readOnly={false}
                            />

                            <TextInput
                                id={"description-input"}
                                label={"Description"}
                                fieldName={"description"}
                                value={newThreadRequest.description}
                                handleFieldChange={handleFieldChange}
                                maxLength={200}
                                readOnly={false}
                            />

                            <TextInput
                                id={"justification-input"}
                                label={"Justification"}
                                fieldName={"justification"}
                                value={newThreadRequest.justification}
                                handleFieldChange={handleFieldChange}
                                maxLength={200}
                                readOnly={false}
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
                                readOnly={false}
                            />
                        </InfoContainer>
                    </InnerContainer>
                    <ButtonsContainer>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onSaveClick}
                            disabled={!isRequestValid}
                            sx={{ width: "120px" }}
                        >
                            Add
                        </Button>
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={onResetClick}
                            disabled={!isResetButtonActive}
                            sx={{ width: "120px" }}
                        >
                            Reset
                        </Button>
                    </ButtonsContainer>
                </Paper>
            </ContentsContainer>
        </MainContainer>
    );
};
