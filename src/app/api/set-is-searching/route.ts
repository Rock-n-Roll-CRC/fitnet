import type { NextRequest } from "next/server";

import { NextResponse } from "next/server";

import { updateProfileIsSearching } from "@/services/actions";

export async function POST(request: NextRequest) {
  try {
    const { value } = (await request.json()) as { value: boolean };

    await updateProfileIsSearching(value);

    return NextResponse.json({ success: true });
  } catch (error) {
    NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error ? error.message : "Something went wrong!",
      },
      { status: 500 },
    );
  }
}
