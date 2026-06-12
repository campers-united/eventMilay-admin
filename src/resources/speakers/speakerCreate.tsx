import {
  Create, SimpleForm, TextInput, required,
} from "react-admin";

export const SpeakerForm = () => (
  <SimpleForm>
    <TextInput source="fullName" label="Nom complet" validate={required()} fullWidth />
    <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
    <TextInput
      source="photoUrl"
      label="URL de la photo"
      fullWidth
      helperText="Lien direct vers une image (https://...)"
    />
    <div className="flex gap-4 w-full">
      <TextInput source="twitter"  label="Twitter (@handle)" sx={{ flex: 1 }} />
      <TextInput source="linkedin" label="LinkedIn (URL)"    sx={{ flex: 1 }} />
      <TextInput source="website"  label="Site web"          sx={{ flex: 1 }} />
    </div>
  </SimpleForm>
);

export const SpeakerCreate = () => (
  <Create title="Nouvel intervenant">
    <SpeakerForm />
  </Create>
);
