import "./adminSearchBar.scss";
import { Autocomplete, TextField, InputAdornment } from "@mui/material";

const AdminSearchBar = ({
  className,
  placeholder = "Search",
  autoFocus = false,
  onInputValue,
  onSearch,
}) => {
  return (
    <form
      className={`admin-search-bar-form ${className}`}
      onSubmit={(e) => {
        e.preventDefault();
        onSearch && onSearch(e.target.searchInput.value);
      }}
    >
      <TextField
        className="admin-search-field"
        name="searchInput"
        fullWidth
        InputProps={{
          type: "search",
          startAdornment: (
            <InputAdornment position="start">
              <i className="bx bx-search"></i>
            </InputAdornment>
          ),
          placeholder,
          autoFocus,
        }}
        onChange={(e) => {
          onInputValue && onInputValue(e.target.value);
        }}
      />
    </form>
  );
};

export const AutocompleteAdminSearchBar = ({
  className,
  placeholder = "Search",
  autoFocus = false,
  options,
  onInputChange,
  getOptionLabel,
  renderOption,
}) => {
  return (
    <Autocomplete
      freeSolo
      disableClearable
      filterOptions={(x) => x}
      renderInput={(params) => (
        <TextField
          className={`admin-search-field ${className}`}
          {...params}
          InputProps={{
            ...params.InputProps,
            type: "search",
            startAdornment: (
              <InputAdornment position="start">
                <i className="bx bx-search"></i>
              </InputAdornment>
            ),
            placeholder,
            autoFocus,
          }}
        />
      )}
      options={options}
      onInputChange={(_, inputValue) => onInputChange(inputValue)}
      getOptionLabel={getOptionLabel}
      renderOption={renderOption}
    />
  );
};

export default AdminSearchBar;
