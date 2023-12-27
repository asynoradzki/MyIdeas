import { Box } from "@mui/material";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { validateEmailRFC2822 } from "../../pages/login/LoginHelpers";

interface TextInputProps {
    id: string;
    label: string;
    fieldName: string;
    value: string | null;
    handleFieldChange: (fieldName: string, value: any) => void;
    maxLength: number;
    readOnly: boolean;
}

export const TextInput: React.FC<TextInputProps> = ({
    id,
    label,
    fieldName,
    value,
    handleFieldChange,
    maxLength,
    readOnly,
}) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const inputText = e.target.value;

        // Limit the input to a specific number of characters, e.g., 100
        if (inputText.length <= maxLength) {
            handleFieldChange(fieldName, inputText);
        }
    };

    const helperText = (): string => {
        if (readOnly) {
            return "";
        }
        if (!value) {
            return "Required";
        }
        if (fieldName === "email" && validateEmailRFC2822(value) === false) {
            return `${value.length}/${maxLength} characters, incorrect e-mail format`;
        }
        return `${value.length}/${maxLength} characters`;
    };

    return (
        <Box sx={{ minHeight: "75px" }}>
            <TextField
                id={id}
                fullWidth
                label={label}
                variant="standard"
                color="secondary"
                multiline
                value={value}
                error={!value && !readOnly && isClicked}
                onFocus={(e) => setIsClicked(true)}
                onBlur={(e) => setIsClicked(false)}
                onChange={handleChange}
                inputProps={{
                    maxLength: maxLength, // Set the maximum number of characters
                    readOnly: readOnly,
                }}
                // helperText={readOnly ? "" : !value ? `Required` : `${value.length}/${maxLength} characters`}
                helperText={helperText()}
            />
        </Box>
    );
};
