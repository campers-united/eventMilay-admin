import {
  Edit, Create, SimpleForm,
  TextInput, DateTimeInput, ReferenceInput, SelectInput,
  ReferenceArrayInput, AutocompleteArrayInput,
  required, useGetOne,
} from "react-admin";
import { useWatch } from "react-hook-form";

const RoomCapacityField = () => {
  const roomId = useWatch({ name: "roomId" });
  const { data: room } = useGetOne("rooms", { id: roomId }, { enabled: !!roomId });
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 0" }}>
      <span style={{ fontSize: 13, color: "#6b7280", minWidth: 120 }}>Capacité</span>
      {room ? (
        <span style={{ fontWeight: 600, color: "#111827" }}>{room.capacity} places</span>
      ) : (
        <span style={{ color: "#9ca3af", fontSize: 13 }}>Sélectionnez une salle</span>
      )}
    </div>
  );
};



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
    <RoomCapacityField />
    <div className="flex gap-4 w-full">
      <DateTimeInput source="startTime" label="Heure de début" validate={required()} sx={{ flex: 1 }} />
      <DateTimeInput source="endTime" label="Heure de fin" validate={required()} sx={{ flex: 1 }} />
    </div>
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
