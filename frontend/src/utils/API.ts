export async function postRead(
  pageNumber: Number,
  company: string,
  limit: Number
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
      }),
    }
  );
  const data = await response.json();
  if (!response.ok) throw Error(data.message);
  return data;
}

export async function postSearch(search: string) {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/read/filter`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        search: search,
      }),
    }
  );
  if (!response.ok) throw Error("Something Went Wrong");
  const data = await response.json();
  return data;
}

export async function getFilter(columns = {}) {
  const params = new URLSearchParams(columns).toString().toLowerCase();
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
