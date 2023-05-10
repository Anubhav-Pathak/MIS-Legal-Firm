async function getAPI() {
    try{
        console.log()
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api`)
        if (!response.ok) throw new Error(response.statusText);
        return await response.json()
    }
    catch (error) {
        console.log(error)
    }
}