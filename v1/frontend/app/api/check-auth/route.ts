import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const authHeader = request.headers.get("authorization");

  if (!authHeader) {
    return NextResponse.json({ message: "No token provided" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  // TODO: Implement actual token verification logic here
  // This is a placeholder implementation
  if (token === "invalid_token") {
    return NextResponse.json({ message: "Invalid token" }, { status: 401 });
  }

  // If the token is valid
  return NextResponse.json({ message: "Token is valid" }, { status: 200 });
}
