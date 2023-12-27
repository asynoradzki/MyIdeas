import { useEffect } from "react";
import { ThreadApi } from "../../api/ThreadApi";
import { toast } from "react-toastify";
import { Box, Button, Input, Stack } from "@mui/material";
import { defaultImage } from "../../constants/constants";
import { PhotoContainer, ResponsiveImage } from "./Photo.styles";
import { ImageUrl } from "../../models/thread/ImageUrl";
import { ImageFile } from "../../models/thread/ImageFile";

interface ThreadComponentProps {
    photo: string;
    readOnly: boolean;
    imageUrl: ImageUrl;
    setImageUrl: React.Dispatch<React.SetStateAction<ImageUrl>>;
    imageFile: ImageFile;
    setImageFile: React.Dispatch<React.SetStateAction<ImageFile>>;
}

const emptyFile: File = new File([""], "empty-file.png", { type: "image/png" });

export const Photo = ({ photo, readOnly, imageUrl, setImageUrl, imageFile, setImageFile }: ThreadComponentProps) => {
    useEffect(() => {
        // console.log("imageFile", imageFile);
        if (!imageFile.current || imageFile.current.size === 0) {
            const inputElement = document.getElementById("upload-photo") as HTMLInputElement;
            if (inputElement) {
                inputElement.value = "";
            }
        }
    }, [imageFile]);

    useEffect(() => {
        const getPhoto = async (downloadUri: string) => {
            try {
                const response = await ThreadApi.getPhoto(downloadUri);
                const file: File = response.data;
                const blobUrl = window.URL.createObjectURL(file);
                setImageFile({ current: file, previous: file });
                setImageUrl({ current: blobUrl, previous: blobUrl });
            } catch (error: any) {
                if (error.response && error.response.status === 404) {
                    toast.error("image not found", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                } else {
                    toast.error("internal server error", {
                        position: toast.POSITION.TOP_RIGHT,
                        autoClose: 2000,
                    });
                }
            }
        };

        if (photo) {
            getPhoto(photo);
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [photo]);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile: File | undefined = event.target.files?.[0];
        if (selectedFile?.type.slice(0, 5) === "image") {
            const blobUrl = window.URL.createObjectURL(selectedFile);

            setImageFile({ ...imageFile, current: selectedFile });
            setImageUrl({ ...imageUrl, current: blobUrl });
        } else {
            toast.error("plese select an image file", {
                position: toast.POSITION.TOP_RIGHT,
                autoClose: 2000,
            });
        }
    };

    const handleRemoveImage = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        // Clear the value of the input element
        // const inputElement = document.getElementById("upload-photo") as HTMLInputElement;
        // if (inputElement) {
        //     inputElement.value = "";
        // }

        // if (imageFile.previous) {
        setImageFile({ ...imageFile, current: emptyFile });
        setImageUrl({ ...imageUrl, current: defaultImage });
        // }
    };

    return (
        <PhotoContainer>
            <ResponsiveImage src={imageUrl.current} alt="Idea" />
            {!readOnly && (
                <Stack
                    direction="row"
                    // spacing={2}
                    alignItems="flex-end"
                    justifyContent="end"
                    width={"100%"}
                    // sx={{ backgroundColor: "yellow" }}
                >
                    <Box width={"250px"}>
                        <label htmlFor="upload-photo">
                            <Input
                                id="upload-photo"
                                name="upload-photo"
                                type="file"
                                onChange={handleImageChange}
                                size="small"
                            />
                        </label>
                    </Box>
                    <Box width={"100px"}>
                        {imageUrl.current !== defaultImage && (
                            <Button variant="contained" onClick={handleRemoveImage} color="secondary">
                                Remove
                            </Button>
                        )}
                    </Box>
                </Stack>
            )}
        </PhotoContainer>
    );
};
