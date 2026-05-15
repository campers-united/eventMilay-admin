import {
  List, Datagrid, TextField, DateField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, DateTimeInput, required,
  Show, SimpleShowLayout, useRecordContext,
} from "react-admin";
import { Box } from "@mui/material";

const CoverColorField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Box
      sx={{
        width: 48,
        height: 24,
        borderRadius: 1,
        background: "linear-gradient(135deg, #7c5cfc, #f059c8)",
        display: "inline-block",
      }}
    />
  );
};

export const EventList = () => (
  <List sort={{ field: "startDate", order: "DESC" }} perPage={25}>
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <TextField source="title" label="Titre" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
      <CoverColorField />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const EventForm = () => (
  <SimpleForm>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={3} fullWidth />
    <TextInput source="location" label="Lieu" fullWidth />
    <DateTimeInput source="startDate" label="Date de début" validate={required()} />
    <DateTimeInput source="endDate" label="Date de fin" validate={required()} />
    <TextInput
      source="coverColor"
      label="Couleur de couverture"
      fullWidth
      helperText="Ex: from-blue-500 to-purple-600"
    />
  </SimpleForm>
);

export const EventEdit = () => (
  <Edit title="Modifier l'événement">
    <EventForm />
  </Edit>
);

export const EventCreate = () => (
  <Create title="Nouvel événement">
    <EventForm />
  </Create>
);

export const EventShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="id" />
      <TextField source="title" label="Titre" />
      <TextField source="description" label="Description" />
      <TextField source="location" label="Lieu" />
      <DateField source="startDate" label="Début" showTime />
      <DateField source="endDate" label="Fin" showTime />
    </SimpleShowLayout>
  </Show>
);
