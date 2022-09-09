import "./upsertInput.scss";
import {
  Autocomplete,
  TextField,
  MenuItem,
  InputAdornment,
} from "@mui/material";
import { useState } from "react";
import { useEffect } from "react";

const defaultValue = {
  multiline: "",
  select: "",
  multiselect: [],
  "creatable-multiselect": [],
};

const UpsertInput = ({ input, value: outerValue, onChange }) => {
  const [value, setValue] = useState(defaultValue[input.type] || "");

  useEffect(() => {
    const newValue =
      outerValue !== null && outerValue !== undefined
        ? outerValue
        : defaultValue[input.type] || "";
    setValue(newValue);
  }, [outerValue, input.type]);

  switch (input.type) {
    case "multiline":
      return (
        <TextField
          className="upsert-input"
          size="small"
          multiline
          label={input.label}
          value={value}
          rows={input.rows}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onChange({ target: { value } })}
        />
      );
    case "select":
      return (
        <TextField
          className="upsert-input upsert-input-select"
          size="small"
          select
          label={input.label}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onChange({ target: { value } })}
        >
          {input.options.map((option) => (
            <MenuItem key={option.value} value={option.value}>
              {option.label}
            </MenuItem>
          ))}
        </TextField>
      );
    case "multiselect":
      return (
        <Autocomplete
          className="upsert-input"
          size="small"
          multiple
          value={value}
          // onChange={(_, value) => onChange({ target: { value } })}
          onChange={(_, value) => setValue(value)}
          onBlur={() => onChange({ target: { value } })}
          options={input.options}
          renderInput={(params) => (
            <TextField {...params} label={input.label} />
          )}
        />
      );
    case "creatable-multiselect":
      return (
        <CreatableMultiselect
          input={input}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onChange({ target: { value } })}
          options={input.options}
        />
      );
    default:
      return (
        <TextField
          className="upsert-input"
          size="small"
          label={input.label}
          value={value}
          type={input.type}
          InputProps={{
            startAdornment:
              input.adornment?.position === "start" ? (
                <InputAdornment position={input.adornment.position}>
                  {input.adornment.unit}
                </InputAdornment>
              ) : undefined,
            endAdornment:
              input.adornment?.position === "end" ? (
                <InputAdornment position={input.adornment.position}>
                  {input.adornment.unit}
                </InputAdornment>
              ) : undefined,
          }}
          onChange={(e) => setValue(e.target.value)}
          onBlur={() => onChange({ target: { value } })}
        />
      );
  }
};

const CreatableMultiselect = ({ input, value, onChange }) => {
  return (
    <Autocomplete
      className="upsert-input"
      size="small"
      multiple
      value={value}
      onChange={(_, options) => {
        const value = options.map((o) => (o.isNew ? o.value : o));
        onChange({ target: { value } });
      }}
      options={input.options}
      renderInput={(params) => <TextField {...params} label={input.label} />}
      filterOptions={(options, params) => {
        const { inputValue } = params;
        const newOption = { isNew: true, value: inputValue, label: inputValue };
        const isExisting = options.some((o) => o === inputValue);
        return inputValue && !isExisting ? [...options, newOption] : options;
      }}
      renderOption={(props, option) => (
        <li {...props}>{option.isNew ? `Add "${option.value}"` : option}</li>
      )}
    />
  );
};

export default UpsertInput;