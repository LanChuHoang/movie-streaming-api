import "./circularAvatar.scss";

const TextAvatar = ({ name }) => {
  return (
    <div className="text-avatar circular-avatar">
      <p>
        {name
          ?.split(" ")
          .slice(0, 2)
          .map((n) => n[0].toUpperCase())
          .join("")}
      </p>
    </div>
  );
};

const NormalAvatar = ({ avatarUrl }) => {
  return (
    <img
      className="normal-avatar circular-avatar"
      src={avatarUrl}
      alt="avatar"
    />
  );
};

const CircularAvatar = ({ avatarUrl, name }) => {
  return avatarUrl ? (
    <NormalAvatar avatarUrl={avatarUrl} />
  ) : (
    <TextAvatar name={name} />
  );
};

export default CircularAvatar;
