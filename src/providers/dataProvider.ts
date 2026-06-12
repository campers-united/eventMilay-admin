import { DataProvider, fetchUtils } from "react-admin";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

const httpClient = (url: string, options: fetchUtils.Options = {}) => {
  const token = localStorage.getItem("admin_token");
  const headers = new Headers(options.headers as HeadersInit);
  if (token) headers.set("Authorization", `Bearer ${token}`);
  return fetchUtils.fetchJson(url, { ...options, headers });
};

const resourceMap: Record<string, string> = {
  events:   "events",
  sessions: "sessions",
  speakers: "speakers",
  rooms:    "rooms",
};

function url(resource: string, id?: string | number) {
  const seg = resourceMap[resource] ?? resource;
  return id ? `${API}/api/${seg}/${id}` : `${API}/api/${seg}`;
}

export const dataProvider: DataProvider = {
  getList: async (resource, params) => {
    const { page, perPage } = params.pagination ?? { page: 1, perPage: 100 };
    const { field, order } = params.sort ?? { field: "id", order: "ASC" };
    const filter = params.filter ?? {};

    const query = new URLSearchParams({
      _page:  String(page),
      _limit: String(perPage),
      _sort:  field,
      _order: order,
      ...Object.fromEntries(Object.entries(filter).map(([k, v]) => [k, String(v)])),
    });

    const { json, headers } = await httpClient(`${url(resource)}?${query}`);
    const data = Array.isArray(json) ? json : json.data ?? [];
    const total = Number(headers.get("X-Total-Count") ?? data.length);
    return { data, total };
  },

  getOne: async (resource, { id }) => {
    const { json } = await httpClient(url(resource, id));
    return { data: json };
  },

  getMany: async (resource, { ids }) => {
    const results = await Promise.all(ids.map((id) => httpClient(url(resource, id))));
    return { data: results.map((r) => r.json) };
  },

  getManyReference: async (resource, params) => {
    const { target, id, pagination, sort } = params;
    const { page = 1, perPage = 100 } = pagination ?? {};
    const { field = "id", order = "ASC" } = sort ?? {};
    const query = new URLSearchParams({
      [target]: String(id),
      _page: String(page),
      _limit: String(perPage),
      _sort: field,
      _order: order,
    });
    const { json, headers } = await httpClient(`${url(resource)}?${query}`);
    const data = Array.isArray(json) ? json : json.data ?? [];
    const total = Number(headers.get("X-Total-Count") ?? data.length);
    return { data, total };
  },

  create: async (resource, { data }) => {
    const { json } = await httpClient(url(resource), {
      method: "POST",
      body: JSON.stringify(data),
    });
    return { data: json };
  },

  update: async (resource, { id, data }) => {
    const { json } = await httpClient(url(resource, id), {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return { data: json };
  },

  updateMany: async (resource, { ids, data }) => {
    await Promise.all(ids.map((id) => httpClient(url(resource, id), { method: "PUT", body: JSON.stringify(data) })));
    return { data: ids };
  },

  delete: async (resource, { id }) => {
    await httpClient(url(resource, id), { method: "DELETE" });
    return { data: { id } } as any;
  },

  deleteMany: async (resource, { ids }) => {
    await Promise.all(ids.map((id) => httpClient(url(resource, id), { method: "DELETE" })));
    return { data: ids };
  },
};
