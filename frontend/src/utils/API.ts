import {ClientData} from "@/utils/Types";

export async function login(username: string, password: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sign-in`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    }
  );
  return response;
}

export async function postRead(
  pageNumber: Number,
  company: string,
  limit: Number,
  tab?: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read?page=${pageNumber}`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        company: company,
        limit: limit,
        tab: tab,
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw Error(data.message);
  return data;
}

export async function postSearch(
  search: string,
  pageNumber: Number,
  limit: Number,
  company: string,
  tab?: string
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read/filter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: search,
        page: pageNumber,
        limit: limit,
        company: company,
        tab: tab,
      }),
    }
  );
  if (!response.ok) throw Error("Something Went Wrong");
  const data = await response.json();
  return data;
}

export async function getFilter(
  columns = {},
  pageNumber: Number,
  limit: Number,
  company: string,
  tab?: string
) {
  const params = new URLSearchParams({
    ...columns,
    page: pageNumber.toString(),
    limit: limit.toString(),
    company: company,
    tab: tab ? tab : "",
  }).toString();

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read/filter?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw Error("Something Went Wrong");
  const data = await response.json();
  return data;
}

export async function getPDFFileNames() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pdf/list`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw Error("Something Went Wrong");
  const data = await response.json();
  return data;
}

export async function createClient(clientData: ClientData) {
  const formData = new FormData();
  Object.entries(clientData).forEach(([key, value]) => {
    if (key === "clientFile") {
      if (!value) return;
      const blob = new Blob([value.buffer]);
      formData.append(`clientFile`, blob, `clientFile`);
    } else if (value) formData.append(key, typeof value === "string" ? value : String(value));
  });
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-user`, {
      method: "POST",
      body: formData,
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Error creating client" + error?.message);
  }
}

export async function getTemplates(company: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/pdf/templates?company=${company}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw Error("Something Went Wrong");
  const data = await response.json();
  return data;
}

export async function getCompanies() {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/companies`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  if (!response.ok) throw new Error("Something went wrong");
  const data = await response.json();
  return data;
}

export async function deleteClient(clientId: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${clientId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  if (!response.ok) throw new Error("Failed to delete client");
  const data = await response.json();
  return data;
}

export async function editClient(
  clientId: string,
  newClientCredentials: Record<string, string>
) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${clientId}`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newClientCredentials),
    }
  );
  if (!response.ok) throw new Error("Failed to edit client");
  const data = await response.json();
  return data;
}
