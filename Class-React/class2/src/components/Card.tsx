import { useState } from "react";
import type { User } from "../types/user";

interface CardProps {
  user?: User;
  present: boolean;
}

export const Card = ({ user, present }: CardProps) => {
  const [isPresent, setIsPresent] = useState(present);
  return (
    <div
      style={{
        border: isPresent ? "5px solid green" : "5px solid red",
        padding: "10px",
        marginBottom: "2px",
        cursor: "pointer",
      }}
      onClick={() => setIsPresent(!isPresent)}
    >
      <h3>{user?.name}</h3>
      <p>{user?.email}</p>
      <h3>{isPresent ? "Present" : "Not Present"}</h3>
    </div>
  );
};
