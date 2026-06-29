import { useRef } from "react";
import {
  Create, SimpleForm, TextInput, required, useInput,
} from "react-admin";

const PhotoUploadInput = (props: { source: string }) => {
  const { field } = useInput(props);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => field.onChange(ev.target?.result);
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ marginBottom: 18 }}>
      <label style={{ display: "block", fontSize: 13, color: "#374151", fontWeight: 500, marginBottom: 6 }}>
        Photo
      </label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={handleFile}
        style={{ display: "none" }}
      />
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          style={{
            display: "inline-flex", alignItems: "center", gap: 6,
            padding: "8px 16px", borderRadius: 8, border: "1px solid #d1d5db",
            background: "#fff", color: "#374151", fontSize: 13, fontWeight: 500,
            cursor: "pointer", transition: "background 0.15s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#f9fafb")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "#fff")}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          Ajouter photo
        </button>
        {field.value && (
          <button
            type="button"
            onClick={() => field.onChange(null)}
            style={{
              background: "none", border: "none", cursor: "pointer",
              color: "#ef4444", fontSize: 11, textDecoration: "underline",
              padding: 0,
            }}
          >
            Supprimer
          </button>
        )}
      </div>
      {field.value && (
        <div style={{ marginTop: 10 }}>
          <img
            src={field.value}
            alt="Aperçu"
            style={{
              maxWidth: 160, maxHeight: 160, borderRadius: 8,
              border: "1px solid #e5e7eb", objectFit: "cover",
            }}
          />
        </div>
      )}
    </div>
  );
};

export const SpeakerForm = () => (
  <SimpleForm>
    <TextInput source="fullName" label="Nom complet" validate={required()} fullWidth />
    <TextInput source="bio" label="Biographie" multiline rows={4} fullWidth />
    <PhotoUploadInput source="photoUrl" />
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
