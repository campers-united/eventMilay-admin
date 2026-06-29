import { Show, SimpleShowLayout, TextField } from "react-admin";

export const SpeakerShow = () => (
  <Show>
    <SimpleShowLayout>
      <TextField source="fullName" label="Nom complet" />
      <TextField source="bio" label="Biographie" />
      <TextField source="photoUrl" label="Photo" />
      <TextField source="twitter" label="Twitter" />
      <TextField source="linkedin" label="LinkedIn" />
      <TextField source="website" label="Site web" />
    </SimpleShowLayout>
  </Show>
);
