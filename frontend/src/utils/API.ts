import { ClientInterface, filter } from "./Types";

// Authentication

export async function getOTP(username: string | undefined, phone: string | undefined) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/otp`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, phone }),
    }
  );
  return response;
}

export async function resetPassword(code: string, password: string, username: string | null, email: string | null) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/reset-password`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ code, password, username, email }),
    }
  );
  return response;
}

export async function login(username: string, password: string, isAdmin: boolean, bypass: boolean | undefined) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/sign-in`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password, isAdmin, bypass }),
    }
  );
  return response;
}

export async function verify(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/verify`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
    }
  );
  return response;
}

// Read Excel 

export async function postRead(pages: number, limit: number, currentTab: string | undefined = undefined, search: string | undefined = undefined, filters: filter[] | undefined = [] ) {
  const token = localStorage.getItem("client") ?? localStorage?.getItem("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read?page=${pages}`,{
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        limit: limit,
        search: search,
        tab: currentTab,
        filters: filters
      }),
    }
  );
  return response;
}

// Filter

export async function getFilter(filter:string) {
  const token = localStorage.getItem("client") ?? localStorage?.getItem("token");
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/filter?filter=${filter}`,{
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
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

// Admin

export async function createClient(clientData: ClientInterface, token: string) {
  const formData = new FormData();
  Object.entries(clientData).forEach(([key, value]) => {
    if (key === "clientFile") {
      if (!value) return;
      formData.append(key, value);
    } else if (value) formData.append(key, typeof value === "string" ? value : String(value));
  });
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-client`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
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

export async function getCompanies(token: string) {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/companies`,{
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
  });
  if (!response.ok) throw new Error(response.statusText);
  const data = await response.json();
  return data;
}

export async function updateFile(clientFile: Blob, token:string, company?: string){
  const formData = new FormData();
  formData.append("clientFile", clientFile);
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/update-file`, {
      method: "POST",
      body: formData,
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error);
    }
    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error("Error updating file" + error?.message);
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

export async function deleteClient(clientId: string, token: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/admin/${clientId}`,
    {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`,
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