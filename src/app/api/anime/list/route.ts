import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";


export async function GET(req: NextRequest) {
  try {
    const response = await fetch(`${env.NEXT_PUBLIC_JIKAN_API_URL}/top/anime?limit=25&page=1`);
    if (response.ok) {
      const data = await response.json();
      return NextResponse.json(data, { status: 200 })
    }
  } catch (e) {
    NextResponse.json({ message: 'Failed to fetch animes' });
  }
  return NextResponse.json("Done");
}
