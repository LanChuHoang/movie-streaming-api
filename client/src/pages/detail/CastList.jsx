import React, { useState, useEffect } from "react";

const CastList = (props) => {
  const [casts, setCasts] = useState([]);

  useEffect(() => {
    setCasts(props.cast.slice(0, 5));
  }, [props.cast]);
  return (
    <div className="casts">
      {casts.map((item, i) => (
        <div key={i} className="casts__item">
          <div
            className="casts__item__img"
            style={{ backgroundImage: `url(${item.avatarUrl})` }}
          ></div>
          <p className="casts__item__name">{item.name}</p>
        </div>
      ))}
    </div>
  );
};

export default CastList;
