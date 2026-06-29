import {
  List, Datagrid, TextField, DateField, ReferenceField,
  EditButton, DeleteButton , useRecordContext} from "react-admin";

  const LiveChip = () => {
    const record = useRecordContext();
    if (!record) return null;
    const now = new Date();
    const start = new Date(record.startTime);
    const end = new Date(record.endTime);
    if (start <= now && now <= end)
      return (
        <span className="inline-block bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
          LIVE
        </span>
      );
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