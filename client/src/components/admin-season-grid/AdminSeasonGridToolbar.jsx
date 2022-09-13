import { Tab, Tabs, IconButton, Button } from "@mui/material";
import { GridToolbarContainer } from "@mui/x-data-grid";
import UpsertInput from "../inputs/upsert-input/UpsertInput";
import "./adminSeasonGridToolbar.scss";

const AdminSeasonGridToolbar = ({
  seasons = [],
  selectedTab,
  onSelectedTabChange,
  onSeasonDetailChange,
  onAddSeasonClick,
  onNewEpisodeClick,
}) => {
  return (
    <GridToolbarContainer className="admin-season-grid-toolbar">
      <div className="tabs-container">
        <Tabs
          variant="scrollable"
          value={selectedTab}
          onChange={onSelectedTabChange}
        >
          {seasons.map((s) => (
            <Tab
              key={s._id}
              label={
                s.seasonNumber !== undefined
                  ? `Season ${s.seasonNumber}`
                  : "New Season"
              }
            />
          ))}
        </Tabs>
        <IconButton
          color="secondary"
          className="season-grid-toolbar-button"
          onClick={onAddSeasonClick}
        >
          <i className="bx bx-plus"></i>
        </IconButton>
      </div>

      <div className="season-detail-inputs">
        {inputs.map((input) => (
          <UpsertInput
            className={`${input.field}-season-input`}
            key={input.field}
            input={input}
            value={
              seasons[selectedTab] ? seasons[selectedTab][input.field] : ""
            }
            onChange={onSeasonDetailChange}
          />
        ))}
      </div>

      <Button
        color="secondary"
        className="season-grid-toolbar-button"
        startIcon={<i className="bx bx-plus"></i>}
        onClick={onNewEpisodeClick}
        variant="text"
      >
        New episode
      </Button>
    </GridToolbarContainer>
  );
};

const inputs = [
  { field: "_id", label: "ID", readOnly: true },
  { field: "title", label: "Title" },
  { field: "seasonNumber", label: "Season Number", type: "number" },
  { field: "releaseDate", label: "Release Date" },
  { field: "posterUrl", label: "Poster URL" },
  { field: "backdropUrl", label: "Backdrop URL" },
  { field: "overview", label: "Overview", rows: 6, type: "multiline" },
];

export default AdminSeasonGridToolbar;
