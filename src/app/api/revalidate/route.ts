import { revalidateTag } from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { GITHUB_REVALIDATE_TAG } from "@/lib/github/client";

export async function POST(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get("secret");

  if (!process.env.REVALIDATE_SECRET || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ message: "Invalid secret" }, { status: 401 });
  }

  revalidateTag(GITHUB_REVALIDATE_TAG, "max");
  return NextResponse.json({ revalidated: true, now: Date.now() });
}
