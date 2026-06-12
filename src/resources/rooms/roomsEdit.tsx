import { Edit } from "react-admin";

import {RoomCreateForm} from "./roomsCreate";
export const RoomEdit = () => (
  <Edit title="Modifier la salle">
    <RoomCreateForm />
  </Edit>
);