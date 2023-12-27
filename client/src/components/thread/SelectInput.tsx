import { Autocomplete, TextField } from "@mui/material";
import { AutocompleteObject } from "../../models/thread/AutocompleteObject";
import { useState } from "react";

interface SelectInputProps {
    fieldName: string;
    label: string;
    initialValue: AutocompleteObject | null;
    handleFieldChange: (fieldName: string, value: any) => void;
    readOnly: boolean;
    options: AutocompleteObject[];
}

export const SelectInput: React.FC<SelectInputProps> = ({
    fieldName,
    label,
    initialValue,
    options,
    handleFieldChange,
    readOnly,
}) => {
    const [isClicked, setIsClicked] = useState<boolean>(false);

    const onSelected = (event: any, newValue: AutocompleteObject | null) => {
        newValue ? handleFieldChange(fieldName, newValue?.id) : handleFieldChange(fieldName, null);
    };

    const isOptionEqualToValue = (option: AutocompleteObject, value: AutocompleteObject | null) =>
        option.id === (value ? value.id : null);

    return (
        <>
            <Autocomplete
                id={label}
                options={options}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        fullWidth
                        label={label}
                        color="secondary"
                        variant="standard"
                        onFocus={(e) => setIsClicked(true)}
                        onBlur={(e) => setIsClicked(false)}
                        error={!initialValue && isClicked}
                        helperText={readOnly ? "" : !initialValue ? "Choose category" : ""}
                    />
                )}
                value={initialValue}
                onChange={onSelected}
                readOnly={readOnly}
                isOptionEqualToValue={isOptionEqualToValue}
            />
        </>
    );
};
