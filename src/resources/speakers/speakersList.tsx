import {
  List, Datagrid, TextField, EditButton, DeleteButton,
  Edit, useRecordContext,
} from "react-admin";

import { SpeakerForm } from "./speakerCreate";

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

export const SpeakerEdit = () => (
  <Edit title="Modifier l'intervenant">
    <SpeakerForm />
  </Edit>
);
