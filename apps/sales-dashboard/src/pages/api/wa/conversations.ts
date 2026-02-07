import clientPromise from "@/services/mongodb";
import type { NextApiRequest, NextApiResponse } from "next";

type WaConversationDoc = {
  phone: string;
  display?: string;
  tags?: string[];
  responded: boolean;
  createdAt: Date;
  lastOpenedAt: Date | null;
  lastUpdatedAt: Date;
  lastRespondedAt: Date | null;
};

function setCors(res: NextApiResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizePhone(input: unknown) {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (!digits) return "";
  // WhatsApp phone numbers (E.164 digits) are typically 9-15 digits.
  if (digits.length < 9 || digits.length > 15) return "";
  return digits;
}

function parseLimit(input: unknown, fallback: number) {
  const n = Number(input);
  if (!Number.isFinite(n)) return fallback;
  return Math.max(1, Math.min(500, Math.trunc(n)));
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const client = await clientPromise;
  const db = client.db("inovasy");
  const col = db.collection<WaConversationDoc>("wa_conversations");

  if (req.method === "GET") {
    const pending =
      req.query.pending === "1" ||
      req.query.pending === "true" ||
      req.query.status === "pending";

    const respondedParam = req.query.responded;
    const hasRespondedFilter =
      typeof respondedParam === "string" && respondedParam.length > 0;
    const responded = respondedParam === "1" || respondedParam === "true";

    const limit = parseLimit(req.query.limit, 50);
    const filter: any = {};
    if (pending) filter.responded = false;
    else if (hasRespondedFilter) filter.responded = responded;

    const countOnly =
      req.query.count === "1" ||
      req.query.count === "true" ||
      req.query.count === "only";
    if (countOnly) {
      const count = await col.countDocuments(filter);
      return res.status(200).json({ ok: true, count });
    }

    const docs = await col
      .find(filter)
      .sort({ lastOpenedAt: -1, lastUpdatedAt: -1 })
      .limit(limit)
      .toArray();

    return res.status(200).json({ ok: true, data: docs });
  }

  if (req.method === "POST") {
    const phone = normalizePhone(req.body?.phone);
    const display =
      typeof req.body?.display === "string" ? req.body.display.trim() : "";

    const tags = Array.isArray(req.body?.tags)
      ? req.body.tags
          .map((t: any) => String(t).trim())
          .filter(Boolean)
          .slice(0, 20)
      : [];

    if (!phone) {
      return res.status(400).json({ ok: false, error: "phone invalido" });
    }

    const now = new Date();

    const update: any = {
      $setOnInsert: {
        phone,
        createdAt: now,
        tags,
      },
      $set: {
        phone,
        display,
        responded: false,
        lastOpenedAt: now,
        lastUpdatedAt: now,
        lastRespondedAt: null,
      },
    };

    // Safe behavior: never clear tags on open; only add if provided.
    if (tags.length) {
      update.$addToSet = { tags: { $each: tags } };
    }

    await col.updateOne({ phone }, update, { upsert: true });

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
