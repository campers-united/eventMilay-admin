import { Edit } from "react-admin";

import { RoomForm } from "./roomsCreate";

export const RoomEdit = () => (
  <Edit title="Modifier la salle">
    <RoomForm />
  </Edit>
);
