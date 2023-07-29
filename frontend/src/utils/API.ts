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

export async function postRead(pageNumber: Number, limit: Number, token: string, user?: Object, tab?: string ) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read?page=${pageNumber}`,
    {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        limit: limit,
        user: user,
      }),
    }
  );
  return response;
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

export async function createClient(clientData: ClientData, token: string) {
  const formData = new FormData();
  Object.entries(clientData).forEach(([key, value]) => {
    if (key === "clientFile") {
      if (!value) return;
      formData.append(key, value);
    } else if (value) formData.append(key, typeof value === "string" ? value : String(value));
  });
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/admin/add-user`, {
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
  if (!response.ok) throw new Error("Something went wrong");
  const data = await response.json();
  return data;
}

export async function updateFile(user:Object, clientFile: Blob, token:string){
  const formData = new FormData();
  console.log(clientFile, user, token);
  formData.append("clientFile", clientFile);
  formData.append("user", JSON.stringify(user));
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
