export async function postRead({pageNumber, company, limit}: {pageNumber: number, company: string, limit: number}){
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/read?page=${pageNumber}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                company: company,
                limit: limit
            })
        })
        if(!response.ok) throw Error("Something Went Wrong");
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error)
    }
}

export async function postSearch(search : string) {
    try{
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/read/filter`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                search: search
            })
        })
        if(!response.ok) throw Error("Something Went Wrong");
        const data = await response.json();
        console.log(data);
        return data;
    }
    catch (error) {
        console.log(error)
    }
}