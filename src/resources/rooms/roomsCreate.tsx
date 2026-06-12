import { SimpleForm  , TextInput ,required} from "react-admin";
export const RoomCreateForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom de la salle" validate={required()} fullWidth />
    <TextInput source="floor" label="Étage / Localisation" fullWidth />
    <TextInput source="capacity" label="Capacité (places)" type="number" fullWidth />
  </SimpleForm>
);