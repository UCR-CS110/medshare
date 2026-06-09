import bcrypt from "bcryptjs";
import connectDB from "@/lib/db"
import User from "@/models/User"

export async function POST(request) {
  try {
    const { username, email, password } = await request.json();

    console.log("Request body:", { username, email, password });

    if (!username || !email || !password) {
      return new Response(JSON.stringify({ error: "All fields are required" }), { status: 400 });
    }

    await connectDB();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new Response(JSON.stringify({ error: "Email already in use" }), { status: 400 });
    }

    const existingUsername = await User.findOne({ name: username });
    if (existingUsername) {
      return new Response(JSON.stringify({ error: "Username already in use" }), { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name: username, email, password: hashedPassword });
    await newUser.save();

    return new Response(JSON.stringify({ message: "User registered successfully" }), { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}