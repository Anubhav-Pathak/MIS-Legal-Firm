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

export async function postSearch(
  search: string,
  pageNumber: Number,
  limit: Number
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
  limit: Number
) {
  const params = new URLSearchParams({
    ...columns,
    page: pageNumber.toString(),
    limit: limit.toString(),
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
