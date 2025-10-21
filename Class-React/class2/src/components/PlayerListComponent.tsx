import type { User } from "../types/user";

interface PlayerListProps {
  users: User[];
}

export const PlayerListComponent = ({ users }: PlayerListProps) => {
  return (
    <ol>
      {users.map((user: User) => (
        <li key={user.id} onClick={() => console.log(user.name)}>
          {user.name} - {user.email}
        </li>
      ))}
    </ol>
  );
};
