import { env } from "@/env";
import { NextResponse, type NextRequest } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const response = await fetch(
      `${env.NEXT_PUBLIC_JIKAN_API_URL}/anime/${id}`,
    );
    if (response.ok) {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      const data = await response.json();
      return NextResponse.json(data.data, { status: 200 });
    }
  } catch (e) {
    NextResponse.json({ message: "Failed to fetch anime" }, {status: 500});
  }
  return NextResponse.json(
    { message: "failed to fetch anime" },
    { status: 500 },
  );
}
