import clientPromise from "@/lib/mongodb";
import { ObjectId } from "mongodb";

export async function GET(request: Request, { params }: { params: { id : string} }) {
  try {
    const { id } = await params;

    const client = await clientPromise;
    const db = client.db("terrainBooking");

    let query = { _id: new ObjectId(id) };
    const terrain = await db.collection("terrains").findOne(query);

    return new Response(JSON.stringify(terrain), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching terrain:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }

}