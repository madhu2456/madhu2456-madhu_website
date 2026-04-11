import { NextResponse } from "next/server";
import { WORKFLOW_ID } from "@/lib/config";

export const runtime = "edge";

export async function POST() {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "OPENAI_API_KEY not configured" },
      { status: 500 },
    );
  }

  if (!WORKFLOW_ID) {
    return NextResponse.json(
      { error: "WORKFLOW_ID not configured" },
      { status: 500 },
    );
  }

  const response = await fetch("https://api.openai.com/v1/chatkit/sessions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
      "OpenAI-Beta": "chatkit_beta=v1",
    },
    body: JSON.stringify({
      workflow: { id: WORKFLOW_ID },
      user: `anon_${crypto.randomUUID()}`,
    }),
  });

  if (!response.ok) {
    const error = await response.text();
    return NextResponse.json(
      { error: `Failed to create session: ${error}` },
      { status: response.status },
    );
  }

  const data = (await response.json()) as { client_secret?: unknown };
  if (typeof data.client_secret !== "string" || data.client_secret.length === 0) {
    return NextResponse.json(
      { error: "ChatKit did not return a valid client secret" },
      { status: 502 },
    );
  }

  return NextResponse.json(
    { clientSecret: data.client_secret },
    {
      headers: {
        "Cache-Control": "no-store",
      },
    },
  );
}
