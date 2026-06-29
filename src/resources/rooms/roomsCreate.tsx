import { SimpleForm, TextInput, NumberInput, required } from "react-admin";

export const RoomForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom de la salle" validate={required()} fullWidth />
    <TextInput source="floor" label="Étage / Localisation" fullWidth />
    <NumberInput source="capacity" label="Capacité (places)" fullWidth />
  </SimpleForm>
);