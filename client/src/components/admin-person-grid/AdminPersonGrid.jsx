import "./adminPersonGrid.scss";
import CrudDataGrid from "../tables/crud-data-grid/CrudDataGrid";
import React, { useEffect, useState, useCallback } from "react";
import useBackendApi from "../../hooks/useBackendApi";
import tmdbApi from "../../api/tmdb/tmdbApi";
import { isDirector, toPersonModel } from "../../api/tmdb/tmdbApi.helper";
import { GENDERS, JOBS } from "../../api/filterOptions";
import AdminPersonGridToolbar from "./AdminPersonGridToolbar";
import { Chip } from "@mui/material";
import { capitalize } from "lodash";
import { toBritishDate } from "../../api/helper";
import ProfileCell from "../table-cells/profile-cell/ProfileCell";

const rowStatus = {
  new: "New",
  edited: "Edited",
  stored: "Stored",
};

const toStoredRow = (row) => ({ ...row, status: rowStatus.stored });
const toEditedRow = (row) => ({ ...row, status: rowStatus.edited });
const toNewRow = (row) => ({ ...row, status: rowStatus.new });
const isRowAdded = (rows, id) =>
  rows ? rows.some((r) => r._id === id) : false;
const countNumStoredRow = (rows) =>
  rows?.reduce(
    (total, row) => (row.status === rowStatus.stored ? total + 1 : total),
    0
  ) || 0;

const AdminPersonGrid = ({
  personType,
  itemType = "movie",
  itemId,
  onPersonIdsChange,
}) => {
  const [rows, setRows] = useState();
  const [isLoading, setIsLoading] = useState(false);
  const backendApi = useBackendApi();

  useEffect(() => {
    if (!rows) return;
    const storedIds = rows
      .filter((r) => r.status === rowStatus.stored)
      .map((r) => r._id);
    onPersonIdsChange(storedIds);
  }, [rows, onPersonIdsChange]);

  useEffect(() => {
    const loadStoredPeople = async (id) => {
      setIsLoading(true);
      try {
        const { cast, directors } = (await backendApi[itemType].getCredits(id))
          .data;
        const storedPeople = (personType === "cast" ? cast : directors).map(
          toStoredRow
        );
        console.log("Load Stored people", storedPeople);
        setRows(storedPeople);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    itemId?.value &&
      itemId.source === "backend-api" &&
      loadStoredPeople(itemId.value);
  }, [itemId, itemType, personType, backendApi]);

  useEffect(() => {
    const fillStoredPeople = (tmdbPeople) =>
      tmdbPeople.map(
        (p) =>
          new Promise(async (resolve, reject) => {
            try {
              const { data: results } = await backendApi.person.searchItems({
                query: p.name,
                limit: 1,
              });
              const storedPerson = results.docs.find((d) => d.name === p.name);
              if (storedPerson) resolve(toStoredRow(storedPerson));
              const notStoredPerson = (await tmdbApi.person.getPerson(p.id))
                .data;
              resolve(toNewRow(toPersonModel(notStoredPerson)));
            } catch (error) {
              reject(error);
            }
          })
      );

    const loadCastAndCrew = async (id) => {
      setIsLoading(true);
      try {
        const fetcher = itemType === "movie" ? tmdbApi.movie : tmdbApi.show;
        const { cast, crew } = (await fetcher.getCredits(id)).data;
        let people;
        if (personType === "cast") {
          people = await Promise.all(fillStoredPeople(cast));
        } else {
          people = await Promise.all(fillStoredPeople(crew.filter(isDirector)));
        }
        console.log("Load Tmdb people", people);
        setRows(people);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    itemId?.value &&
      itemId.source === "tmdb-api" &&
      loadCastAndCrew(itemId.value);
  }, [itemId, itemType, personType, backendApi]);

  const handlePersonDelete = useCallback((id) => {
    setRows((prevRows) => prevRows.filter((r) => r._id !== id));
  }, []);

  const handlePersonEdit = useCallback(({ row }) => {
    const editedRow = row.status !== rowStatus.new ? toEditedRow(row) : row;
    setRows((prevRows) =>
      prevRows.map((r) => (r._id === row._id ? editedRow : r))
    );
  }, []);

  const handleUpdateClick = async () => {
    if (!rows) return;
    setIsLoading(true);
    const toAddPeople = rows.filter((r) => r.status === rowStatus.new);
    const toUpdatePeople = rows.filter((r) => r.status === rowStatus.edited);
    const responses = await Promise.all([
      ...toAddPeople.map(({ _id, status, ...data }) =>
        backendApi.person.addItem(data)
      ),
      ...toUpdatePeople.map(({ _id, status, ...data }) =>
        backendApi.person.updateItem(_id, data)
      ),
    ]);
    const updatedPeople = responses.map((r) => r.data);
    const newRows = rows.map((r) =>
      toStoredRow(updatedPeople.find((p) => p.name === r.name) || r)
    );
    console.log("updated", newRows);
    setRows(newRows);
    setIsLoading(false);
  };

  return (
    <div
      className="admin-person-grid-container"
      style={{ height: 400, width: "100%" }}
    >
      <CrudDataGrid
        rows={rows || []}
        columns={columns}
        loading={isLoading}
        getRowId={(row) => row._id}
        components={{
          Toolbar: AdminPersonGridToolbar,
        }}
        componentsProps={{
          toolbar: {
            validateNewRowId: (id) => !isRowAdded(rows, id),
            onNewRowSave: (newPerson) => {
              const newRow = toStoredRow(newPerson);
              setRows((prevRows) =>
                prevRows ? [...prevRows, newRow] : [newRow]
              );
            },
            numRows: rows?.length || 0,
            numStoredRows: countNumStoredRow(rows),
            onUpdateClick: handleUpdateClick,
          },
        }}
        onRowEditStop={handlePersonEdit}
        onDeleteRow={handlePersonDelete}
      />
    </div>
  );
};

const columns = [
  { field: "_id", headerName: "ID", flex: 1.5, minWidth: 220 },
  {
    field: "name",
    headerName: "Name",
    flex: 2,
    minWidth: 220,
    editable: true,
    renderCell: ({ row }) => (
      <ProfileCell
        avatarUrl={row.avatarUrl}
        name={row.name}
        avatarSize="small"
      />
    ),
  },
  {
    field: "status",
    headerName: "Status",
    renderCell: ({ row }) => {
      switch (row.status) {
        case rowStatus.stored:
          return (
            <Chip
              className="stored-chip"
              size="small"
              icon={<i className="bx bxs-check-circle"></i>}
              label={row.status}
            />
          );
        case rowStatus.new:
          return <Chip className="new-chip" size="small" label={row.status} />;
        case rowStatus.edited:
          return (
            <Chip className="edited-chip" size="small" label={row.status} />
          );
        default:
          return <Chip size="small" label="Unknown" />;
      }
    },
  },
  {
    field: "gender",
    headerName: "Gender",
    type: "singleSelect",
    width: 70,
    valueOptions: GENDERS,
    valueFormatter: ({ value }) => capitalize(value),
    editable: true,
  },
  {
    field: "dob",
    headerName: "Birthday",
    type: "date",
    width: 110,
    valueFormatter: ({ value }) => toBritishDate(value),
    editable: true,
  },
  {
    field: "pob",
    headerName: "Birthplace",
    width: 150,
    valueFormatter: ({ value }) => value?.split(",").slice(-2).join(","),
    editable: true,
  },
  {
    field: "job",
    headerName: "Job",
    type: "singleSelect",
    width: 80,
    valueOptions: JOBS,
    editable: true,
  },
  { field: "biography", headerName: "Biography", editable: true },
  { field: "avatarUrl", headerName: "Avatar URL", editable: true },
];

export default React.memo(AdminPersonGrid);
