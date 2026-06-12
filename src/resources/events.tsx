import {
  List, Datagrid, TextField, DateField, EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, DateTimeInput, required,
  Show, SimpleShowLayout,
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

const EventForm = () => (
  <SimpleForm>
    <TextInput source="title" label="Titre" validate={required()} fullWidth />
    <TextInput source="description" label="Description" multiline rows={3} fullWidth />
    <TextInput source="location" label="Lieu" fullWidth />
    <DateTimeInput source="startDate" label="Date de début" validate={required()} />
    <DateTimeInput source="endDate" label="Date de fin" validate={required()} />
    <TextInput
      source="coverPicture"
      label="Image de couverture"
      fullWidth
      helperText="URL de l'image de couverture"
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
