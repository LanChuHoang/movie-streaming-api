import "./adminSeasonGrid.scss";
import { toBritishDate } from "../../api/helper";
import CrudDataGrid from "../tables/crud-data-grid/CrudDataGrid";
import { Avatar, CardHeader } from "@mui/material";
import AdminSeasonGridToolbar from "./AdminSeasonGridToolbar";
import React, { useState, useCallback, useEffect } from "react";
import {
  newEpisodeId,
  newSeasonId,
  toSeasonModel,
} from "../../api/tmdb/tmdbApi.helper";
import useBackendApi from "../../hooks/useBackendApi";
import tmdbApi from "../../api/tmdb/tmdbApi";

const AdminSeasonGrid = ({ showId, onChange }) => {
  const [loading, setLoading] = useState(false);
  const [seasons, setSeasons] = useState([]);
  const [selectedTab, setSelectedTab] = useState(0);
  const [onAddingSeason, setOnAddingSeason] = useState(false);
  const [onAddingEpisode, setOnAddingEpisode] = useState(false);
  const backendApi = useBackendApi().show;

  // Loading data from backend api
  useEffect(() => {
    const loadStoredSeasons = async (id) => {
      try {
        setLoading(true);
        const storedSeasons = (await backendApi.getSeasons(id)).data;
        console.log("Load stored seasons", storedSeasons);
        setSeasons(storedSeasons);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (showId.value && showId.source === "backend-api")
      loadStoredSeasons(showId.value);
  }, [showId, backendApi]);

  // Loading data from tmdb api
  useEffect(() => {
    const loadTmdbSeasons = async (id) => {
      try {
        setLoading(true);
        const tmdbSeasons = await tmdbApi.show.getSeasons(id);
        const convertedSeasons = tmdbSeasons.map(toSeasonModel);
        console.log("Load tmdb seasons", convertedSeasons);
        setSeasons(convertedSeasons);
        setSelectedTab(0); // reset selected tab
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    if (showId.value && showId.source === "tmdb-api")
      loadTmdbSeasons(showId.value);
  }, [showId]);

  // Dispatch changes to parent component
  useEffect(() => {
    const seasonsData = seasons.map(({ _id, episodes, ...s }) => ({
      ...s,
      episodes: episodes.map(({ _id, ...e }) => e),
    }));
    onChange(seasonsData);
  }, [seasons, onChange]);

  // Change selected tab to new season
  useEffect(() => {
    if (onAddingSeason) {
      setOnAddingSeason(false);
      setSelectedTab(seasons.length - 1);
    }
  }, [seasons.length, onAddingSeason]);

  // Scroll grid to bottom when new episode created
  useEffect(() => {
    if (onAddingEpisode) {
      setOnAddingEpisode(false);
      scrollToGridBottom();
    }
  }, [onAddingEpisode]);

  const handleAddSeasonClick = useCallback(() => {
    setSeasons((prevSeasons) => [...prevSeasons, { _id: newSeasonId() }]);
    setOnAddingSeason(true);
  }, []);

  const handleSeasonDetailChange = useCallback(
    (fieldName, value) => {
      setSeasons((prevSeasons) => {
        const newSeasons = prevSeasons.map((s, i) =>
          i === selectedTab ? { ...s, [fieldName]: value } : s
        );
        return newSeasons;
      });
    },
    [selectedTab]
  );

  const handleNewEpisodeClick = useCallback(() => {
    setSeasons((prevSeasons) => {
      const episodes = [
        ...(prevSeasons[selectedTab].episodes || []),
        { _id: newEpisodeId() },
      ];
      const newSeasons = prevSeasons.map((s, i) =>
        i === selectedTab ? { ...s, episodes } : s
      );
      return newSeasons;
    });
    setOnAddingEpisode(true);
  }, [selectedTab]);

  const handleEpisodeEdit = useCallback(
    ({ row }) => {
      setSeasons((prevSeasons) => {
        const episodes = prevSeasons[selectedTab].episodes.map((ep) =>
          ep._id === row._id ? row : ep
        );
        const newSeasons = prevSeasons.map((s, i) =>
          i === selectedTab ? { ...s, episodes } : s
        );
        return newSeasons;
      });
    },
    [selectedTab]
  );

  const handleEpisodeDelete = useCallback(
    (id) => {
      setSeasons((prevSeasons) => {
        const episodes = prevSeasons[selectedTab].episodes.filter(
          (ep) => ep._id !== id
        );
        const newSeasons = prevSeasons.map((s, i) =>
          i === selectedTab ? { ...s, episodes } : s
        );
        return newSeasons;
      });
    },
    [selectedTab]
  );

  return (
    <div style={{ height: 800, width: "100%" }}>
      <CrudDataGrid
        loading={loading}
        rows={seasons[selectedTab]?.episodes || []}
        columns={columns}
        getRowId={(row) => row._id}
        components={{ Toolbar: AdminSeasonGridToolbar }}
        componentsProps={{
          toolbar: {
            seasons,
            selectedTab: selectedTab >= seasons.length ? 0 : selectedTab,
            onSelectedTabChange: (_, newValue) => setSelectedTab(newValue),
            onSeasonDetailChange: handleSeasonDetailChange,
            onAddSeasonClick: handleAddSeasonClick,
            onNewEpisodeClick: handleNewEpisodeClick,
          },
        }}
        onDeleteRow={handleEpisodeDelete}
        onRowEditStop={handleEpisodeEdit}
      />
    </div>
  );
};

const scrollToGridBottom = () => {
  const scroller = document.querySelector(".MuiDataGrid-virtualScroller");
  console.log(scroller.scrollHeight);
  scroller.scrollTop = scroller.scrollHeight;
};

const columns = [
  { field: "_id", headerName: "ID", flex: 1.5, minWidth: 220 },
  {
    field: "episodeNumber",
    headerName: "Episode",
    type: "number",
    editable: true,
  },
  {
    field: "title",
    headerName: "Title",
    flex: 2,
    minWidth: 220,
    editable: true,
    renderCell: ({ row }) => (
      <CardHeader
        className="episode-card-header"
        avatar={
          <Avatar src={row.thumbnailUrl} variant="rounded" alt={row.title}>
            <i className="bx bxs-movie-play" />
          </Avatar>
        }
        title={row.title}
      />
    ),
  },
  {
    field: "airDate",
    headerName: "Air date",
    minWidth: 120,
    width: 110,
    valueFormatter: ({ value }) => toBritishDate(value),
    editable: true,
  },
  { field: "runtime", headerName: "Runtime", editable: true },
  { field: "overview", headerName: "Overview", editable: true },
  { field: "thumbnailUrl", headerName: "Thumbnail URL", editable: true },
];

export default React.memo(AdminSeasonGrid);
