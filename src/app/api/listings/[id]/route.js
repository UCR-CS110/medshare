import connectDB from "@/lib/db";
import Listing from "@/models/Listing";

export async function GET(req, { params }) {
  try {
    await connectDB();
    const { id } = await params; 
    const listing = await Listing.findById(id).populate("seller", "name bio");
    if (!listing) return Response.json({ error: "Not found" }, { status: 404 });
    return Response.json(listing);
  } catch (error) {
    console.error("Listing fetch error:", error.message);
    return Response.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) return Response.json({ error: "Unauthorized" }, { status: 401 });

    await connectDB();
    const { id } = await params;
    await Listing.findByIdAndDelete(id);
    return Response.json({ success: true });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}