import {
  List, Datagrid, TextField, DateField, ReferenceField,
  EditButton, DeleteButton, Edit, Create, SimpleForm,
  TextInput, DateTimeInput, ReferenceInput, SelectInput,
  ReferenceArrayInput, AutocompleteArrayInput,
  required, useRecordContext,
} from "react-admin";
import { Chip, Box } from "@mui/material";

const LiveChip = () => {
  const record = useRecordContext();
  if (!record) return null;
  const now = new Date();
  const start = new Date(record.startTime);
  const end = new Date(record.endTime);
  if (start <= now && now <= end)
    return <Chip label="LIVE" size="small" sx={{ background: "#ff4444", color: "#fff", fontWeight: 700, fontSize: 10 }} />;
  return null;
};

export const SessionList = () => (
  <List sort={{ field: "startTime", order: "ASC" }} perPage={50}>
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <TextField source="title" label="Titre" />
      <ReferenceField source="eventId" reference="events" label="Événement">
        <TextField source="title" />
      </ReferenceField>
      <ReferenceField source="roomId" reference="rooms" label="Salle" emptyText="—">
        <TextField source="name" />
      </ReferenceField>
      <TextField source="track" label="Track" emptyText="—" />
      <DateField source="startTime" label="Début" showTime />
      <DateField source="endTime" label="Fin" showTime />
      <LiveChip />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const SessionForm = () => (
  <SimpleForm>
    <ReferenceInput source="eventId" reference="events" label="Événement">
      <SelectInput optionText="title" validate={required()} fullWidth />
    </ReferenceInput>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={3} fullWidth />
    <TextInput source="track" label="Track (ex: Backend, Design…)" fullWidth />
    <ReferenceInput source="roomId" reference="rooms" label="Salle">
      <SelectInput optionText="name" fullWidth />
    </ReferenceInput>
    <Box display="flex" gap={2} width="100%">
      <DateTimeInput source="startTime" label="Heure de début" validate={required()} sx={{ flex: 1 }} />
      <DateTimeInput source="endTime" label="Heure de fin" validate={required()} sx={{ flex: 1 }} />
    </Box>
    <TextInput source="capacity" label="Capacité (places)" type="number" />
    <ReferenceArrayInput source="speakerIds" reference="speakers" label="Intervenants">
      <AutocompleteArrayInput
        optionText="fullName"
        fullWidth
        helperText="Sélectionnez un ou plusieurs intervenants"
      />
    </ReferenceArrayInput>
  </SimpleForm>
);

export const SessionEdit = () => (
  <Edit title="Modifier la session">
    <SessionForm />
  </Edit>
);

export const SessionCreate = () => (
  <Create title="Nouvelle session">
    <SessionForm />
  </Create>
);
