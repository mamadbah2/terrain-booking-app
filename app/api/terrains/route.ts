import clientPromise from "@/lib/mongodb";

export async function GET(request: Request) {
    const searchParams = new URL(request.url).searchParams;
    const location = searchParams.get("location");

    if (!location) {
        return new Response(JSON.stringify({ error: "Location is required" }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
        });
    }

    try {
        const client = await clientPromise
        const db = client.db("terrainBooking");

        let query = { location: { $regex: location, $options: "i" } };

        const terrainsMatch = await db.collection("terrains").find(query).toArray();

        return new Response(JSON.stringify(terrainsMatch), {
            status: 200,
            headers: { "Content-Type": "application/json" },
        });
    } catch (error) {
        console.error("Erreur lors de la récupération des terrains:", error);
        return new Response(JSON.stringify({ error: "Erreur lors de la récupération des terrains" }), {
            status: 500,
            headers: { "Content-Type": "application/json" },
        });
    }

}