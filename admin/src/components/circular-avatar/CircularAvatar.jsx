import "./circularAvatar.scss";
import { Avatar } from "@mui/material";

const avatarSize = {
  small: "small",
  standard: "standard",
  large: "large",
};

const CircularAvatar = ({ avatarUrl, name, size = avatarSize.standard }) => {
  return (
    <Avatar
      className={`${size}-avatar circular-avatar`}
      alt={name}
      src={avatarUrl}
    >
      {name
        ?.split(" ")
        .slice(0, 2)
        .map((n) => n[0].toUpperCase())
        .join("")}
    </Avatar>
  );
};

export default CircularAvatar;
