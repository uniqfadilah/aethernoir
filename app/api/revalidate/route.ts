import { revalidateTag } from "next/cache";
import { NextResponse, type NextRequest } from "next/server";
import { parseBody } from "next-sanity/webhook";
import { env } from "../../../lib/env";
import { SANITY_TAG } from "../../../lib/sanity/revalidate";

type Payload = { _type?: string; _id?: string; slug?: { current?: string } };

export async function POST(req: NextRequest) {
  if (!env.SANITY_REVALIDATE_SECRET) {
    return NextResponse.json(
      { ok: false, error: "Webhook secret not configured." },
      { status: 500 },
    );
  }

  try {
    const { isValidSignature, body } = await parseBody<Payload>(
      req,
      env.SANITY_REVALIDATE_SECRET,
    );

    if (!isValidSignature) {
      return NextResponse.json(
        { ok: false, error: "Invalid signature." },
        { status: 401 },
      );
    }

    revalidateTag(SANITY_TAG, { expire: 0 });
    if (body?._type) revalidateTag(body._type, { expire: 0 });

    return NextResponse.json({ ok: true, revalidated: true });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    return NextResponse.json({ ok: false, error: msg }, { status: 500 });
  }
}
