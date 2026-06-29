import {
  List, Datagrid, TextField, DateField, EditButton, DeleteButton
} from "react-admin";

export const EventList = () => (
  <List sort={{ field: "startDate", order: "DESC" }} perPage={25}>
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);