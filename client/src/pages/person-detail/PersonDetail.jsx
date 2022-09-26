import { Avatar } from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import useBackendApi from "../../hooks/useBackendApi";
import MediaList from "./media-list/MediaList";
import "./personDetail.scss";

const PersonDetail = () => {
  const { id } = useParams();
  const [person, setPerson] = useState();
  const [credits, setCredits] = useState();
  const backendApi = useBackendApi().person;

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    const loadPersonDetail = async (id) => {
      const { data } = await backendApi.getItem(id);
      setPerson(data);
    };
    id && loadPersonDetail(id);
  }, [id, backendApi]);

  useEffect(() => {
    const loadPersonCredits = async (id) => {
      const { data } = await backendApi.getCredits(id);
      const joinedMovies = [...data.movie.cast, ...data.movie.director];
      const joinedShows = [...data.show.cast, ...data.show.director];
      setCredits({ joinedMovies, joinedShows });
    };
    id && loadPersonCredits(id);
  }, [id, backendApi]);

  return (
    <div className="person-detail-container container mb-3">
      <div className="detail-section">
        <div className="backdrop-container ">
          <img loading="lazy" src={person?.avatarUrl} alt={person?.name} />
          <div className="backdrop-overlay apple-dark-blur" />
        </div>
        <div className="info-container">
          <Avatar
            src={person?.avatarUrl?.replace("w185", "w300")}
            alt={person?.name}
          >
            {person?.name[0].toUpperCase()}
          </Avatar>
          <div className="detail-container">
            <h1 className="person-name">{person?.name}</h1>
            <div className="biography">
              {formatBiography(person?.biography)}
            </div>
            <div className="mini-info-container">
              <MiniInforItem label="Job" value={person?.job} />
              <MiniInforItem label="Birthday" value={formatDate(person?.dob)} />
              {person?.dod && (
                <MiniInforItem
                  label="Deathday"
                  value={formatDate(person?.dod)}
                />
              )}
              <MiniInforItem label="Born in" value={person?.pob} />
            </div>
          </div>
        </div>
      </div>
      <div className="joined-media-section">
        {credits?.joinedMovies.length > 0 && (
          <MediaList
            title="Movies"
            items={credits?.joinedMovies}
            itemType="movie"
          />
        )}
        {credits?.joinedShows.length > 0 && (
          <MediaList
            title="Shows"
            items={credits?.joinedShows}
            itemType="show"
          />
        )}
      </div>
    </div>
  );
};

const MiniInforItem = ({ label, value }) => {
  return (
    <div className="mini-info-item">
      {/* <p>{label}</p> */}
      <p>{value}</p>
    </div>
  );
};

const formatDate = (dateString) =>
  dateString
    ? new Date(dateString).toLocaleDateString("en-GB", {
        timeZone: "UTC",
        day: "numeric",
        month: "short",
        year: "numeric",
      })
    : "";
const formatBiography = (biography) => biography || "";

export default PersonDetail;
