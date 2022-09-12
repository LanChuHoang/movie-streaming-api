import { Tab, Tabs } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import UpsertInput from "../inputs/upsert-input/UpsertInput";
import "./adminSeasonGridToolbar.scss";

const AdminSeasonGridToolbar = ({
  seasons = [],
  selectedTab,
  onSelectedTabChange,
  onSeasonDetailChange,
}) => {
  return (
    <GridToolbarContainer className="admin-season-grid-toolbar">
      <Tabs
        variant="scrollable"
        value={selectedTab}
        onChange={onSelectedTabChange}
      >
        {seasons.map((s) => (
          <Tab key={s.seasonNumber} label={`Season ${s.seasonNumber}`} />
        ))}
      </Tabs>
      <div className="season-detail-inputs">
        {inputs.map((input) => (
          <UpsertInput
            className={`${input.field}-season-input`}
            key={input.field}
            input={input}
            value={
              seasons[selectedTab] ? seasons[selectedTab][input.field] : ""
            }
            onChange={(e) => onSeasonDetailChange(input.field, e.target.value)}
          />
        ))}
      </div>
    </GridToolbarContainer>
  );
};

const inputs = [
  { field: "_id", label: "ID", readOnly: true },
  { field: "title", label: "Title" },
  { field: "seasonNumber", label: "Season Number" },
  { field: "releaseDate", label: "Release Date" },
  { field: "posterUrl", label: "Poster URL" },
  { field: "backdropUrl", label: "Backdrop URL" },
  { field: "overview", label: "Overview", rows: 6, type: "multiline" },
];

export default AdminSeasonGridToolbar;
