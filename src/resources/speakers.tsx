import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, required, useRecordContext,
} from "react-admin";
import { Avatar, Box } from "@mui/material";

const AvatarField = () => {
  const record = useRecordContext();
  if (!record) return null;
  return (
    <Avatar src={record.photoUrl || ""} alt={record.fullName} sx={{ width: 36, height: 36, fontSize: 14 }}>
      {record.fullName?.[0]}
    </Avatar>
  );
};

export const SpeakerList = () => (
  <List sort={{ field: "fullName", order: "ASC" }} perPage={25}>
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <AvatarField />
      <TextField source="fullName" label="Nom complet" />
      <TextField source="bio" label="Bio" />
      <TextField source="twitter" label="Twitter" />
      <TextField source="linkedin" label="LinkedIn" />
      <EditButton />
      <DeleteButton />
    </Datagrid>
  </List>
);

const SpeakerForm = () => (
  <SimpleForm>
    <TextInput source="fullName" label="Nom complet" validate={required()} fullWidth />
    <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
    <TextInput source="photoUrl" label="URL de la photo" fullWidth helperText="Lien direct vers une image (https://...)" />
    <Box display="flex" gap={2} width="100%">
      <TextInput source="twitter"  label="Twitter (@handle)" sx={{ flex: 1 }} />
      <TextInput source="linkedin" label="LinkedIn (URL)"    sx={{ flex: 1 }} />
      <TextInput source="website"  label="Site web"          sx={{ flex: 1 }} />
    </Box>
  </SimpleForm>
);

export const SpeakerEdit = () => (
  <Edit title="Modifier l'intervenant">
    <SpeakerForm />
  </Edit>
);

export const SpeakerCreate = () => (
  <Create title="Nouvel intervenant">
    <SpeakerForm />
  </Create>
);
