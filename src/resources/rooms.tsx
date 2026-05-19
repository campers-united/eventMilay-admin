import {
  List, Datagrid, TextField, NumberField,
  EditButton, DeleteButton, Edit, Create, SimpleForm,
  TextInput, NumberInput, required,
} from "react-admin";

export const RoomList = () => (
  <List sort={{ field: "name", order: "ASC" }} perPage={25}>
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <TextField source="name" label="Nom de la salle" />
      <NumberField source="capacity" label="Capacité" emptyText="—" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const RoomForm = () => (
  <SimpleForm>
    <TextInput source="name" label="Nom de la salle" validate={required()} fullWidth />
    <NumberInput source="capacity" label="Capacité (places)" min={1} />
  </SimpleForm>
);

export const RoomEdit = () => (
  <Edit title="Modifier la salle">
    <RoomForm />
  </Edit>
);

export const RoomCreate = () => (
  <Create title="Nouvelle salle">
    <RoomForm />
  </Create>
);