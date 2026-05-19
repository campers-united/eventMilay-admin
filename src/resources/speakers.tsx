import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, required, useRecordContext,
} from "react-admin";

/* Avatar component built with Tailwind */
const AvatarField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const initials = record.fullName?.[0]?.toUpperCase() ?? "?";
  return record.photoUrl ? (
    <img
      src={record.photoUrl}
      alt={record.fullName}
      className="w-9 h-9 rounded-full object-cover border border-gray-200"
    />
  ) : (
    <span className="w-9 h-9 rounded-full bg-violet-100 text-violet-600 text-sm font-semibold flex items-center justify-center">
      {initials}
    </span>
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
    <TextInput
      source="photoUrl"
      label="URL de la photo"
      fullWidth
      helperText="Lien direct vers une image (https://...)"
    />
    {/* Social links in a row */}
    <div className="flex gap-4 w-full">
      <TextInput source="twitter"  label="Twitter (@handle)" sx={{ flex: 1 }} />
      <TextInput source="linkedin" label="LinkedIn (URL)"    sx={{ flex: 1 }} />
      <TextInput source="website"  label="Site web"          sx={{ flex: 1 }} />
    </div>
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