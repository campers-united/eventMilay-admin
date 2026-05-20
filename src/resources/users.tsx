/**
 * users.tsx
 *
 * Resource react-admin pour la gestion des comptes administrateurs.
 * Seul un admin connecté peut créer / modifier / supprimer des comptes.
 *
 * Endpoints backend attendus :
 *   GET    /api/users          → liste paginée  { data: [], total }  + header X-Total-Count
 *   GET    /api/users/:id      → un utilisateur
 *   POST   /api/users          → créer un compte  { name, email, password, role }
 *   PUT    /api/users/:id      → modifier         { name, email, role }
 *   DELETE /api/users/:id      → supprimer
 */

import {
  List, Datagrid, TextField, DateField, EmailField,
  EditButton, DeleteButton,
  Edit, Create, SimpleForm, TextInput, SelectInput,
  required, email as emailValidator,
  useRecordContext, useGetIdentity,
} from "react-admin";

/* ─── Badge rôle ─── */
const RoleBadge = () => {
  const record = useRecordContext();
  if (!record) return null;
  const isSuperAdmin = record.role === "superadmin";
  return (
    <span style={{
      display: "inline-block",
      background: isSuperAdmin ? "rgba(240,89,200,0.12)" : "rgba(124,92,252,0.12)",
      color:      isSuperAdmin ? "#f059c8" : "#7c5cfc",
      border:     `1px solid ${isSuperAdmin ? "rgba(240,89,200,0.30)" : "rgba(124,92,252,0.30)"}`,
      borderRadius: 999, padding: "2px 10px",
      fontSize: 11, fontWeight: 600,
    }}>
      {isSuperAdmin ? "Super Admin" : "Admin"}
    </span>
  );
};

/* ─── Avatar initiales ─── */
const AvatarField = () => {
  const record = useRecordContext();
  if (!record) return null;
  const initials = (record.name || record.email || "?")[0].toUpperCase();
  return (
    <span style={{
      width: 34, height: 34, borderRadius: "50%",
      background: "rgba(124,92,252,0.15)",
      color: "#7c5cfc", fontSize: 13, fontWeight: 700,
      display: "inline-flex", alignItems: "center", justifyContent: "center",
      border: "1px solid rgba(124,92,252,0.25)",
    }}>
      {initials}
    </span>
  );
};

/* ─── Protection : empêche de supprimer son propre compte ─── */
const SafeDeleteButton = () => {
  const record   = useRecordContext();
  const { data: identity } = useGetIdentity();
  if (!record || record.id === identity?.id) return null; // on cache le bouton
  return <DeleteButton />;
};

/* ═══════════════════════
   LISTE
═══════════════════════ */
export const UserList = () => (
  <List sort={{ field: "createdAt", order: "DESC" }} perPage={25} title="Administrateurs">
    <Datagrid bulkActionButtons={false} rowClick="edit">
      <AvatarField />
      <TextField  source="name"      label="Nom" />
      <EmailField source="email"     label="Email" />
      <RoleBadge />
      <DateField  source="createdAt" label="Créé le" showTime />
      <EditButton />
      <SafeDeleteButton />
    </Datagrid>
  </List>
);

/* ═══════════════════════
   CRÉATION
═══════════════════════ */
export const UserCreate = () => (
  <Create title="Nouveau compte administrateur">
    <SimpleForm>
      <TextInput
        source="name"
        label="Nom complet"
        validate={required()}
        fullWidth
      />
      <TextInput
        source="email"
        label="Adresse email"
        type="email"
        validate={[required(), emailValidator()]}
        fullWidth
      />
      <TextInput
        source="password"
        label="Mot de passe temporaire"
        type="password"
        validate={required()}
        fullWidth
        helperText="L'utilisateur pourra le changer après sa première connexion."
      />
      <SelectInput
        source="role"
        label="Rôle"
        defaultValue="admin"
        validate={required()}
        choices={[
          { id: "admin",      name: "Admin" },
          { id: "superadmin", name: "Super Admin" },
        ]}
      />
    </SimpleForm>
  </Create>
);

/* ═══════════════════════
   ÉDITION
═══════════════════════ */
export const UserEdit = () => (
  <Edit title="Modifier le compte">
    <SimpleForm>
      <TextInput
        source="name"
        label="Nom complet"
        validate={required()}
        fullWidth
      />
      <TextInput
        source="email"
        label="Adresse email"
        type="email"
        validate={[required(), emailValidator()]}
        fullWidth
      />
      <TextInput
        source="password"
        label="Nouveau mot de passe"
        type="password"
        fullWidth
        helperText="Laisser vide pour ne pas modifier le mot de passe."
      />
      <SelectInput
        source="role"
        label="Rôle"
        validate={required()}
        choices={[
          { id: "admin",      name: "Admin" },
          { id: "superadmin", name: "Super Admin" },
        ]}
      />
    </SimpleForm>
  </Edit>
);