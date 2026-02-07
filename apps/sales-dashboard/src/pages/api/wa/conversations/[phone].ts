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
  res.setHeader("Access-Control-Allow-Methods", "GET,PATCH,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
}

function normalizePhone(input: unknown) {
  const digits = String(input ?? "").replace(/\D/g, "");
  if (!digits) return "";
  if (digits.length < 9 || digits.length > 15) return "";
  return digits;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  setCors(res);
  if (req.method === "OPTIONS") return res.status(200).end();

  const phone = normalizePhone(req.query.phone);
  if (!phone)
    return res.status(400).json({ ok: false, error: "phone invalido" });

  const client = await clientPromise;
  const db = client.db("inovasy");
  const col = db.collection<WaConversationDoc>("wa_conversations");

  if (req.method === "GET") {
    const doc = await col.findOne({ phone });
    if (!doc) return res.status(404).json({ ok: false, error: "not_found" });
    return res.status(200).json({ ok: true, data: doc });
  }

  if (req.method === "PATCH") {
    const now = new Date();

    const update: any = {
      lastUpdatedAt: now,
    };

    if (typeof req.body?.display === "string") {
      update.display = req.body.display.trim();
    }

    if (Array.isArray(req.body?.tags)) {
      update.tags = req.body.tags
        .map((t: any) => String(t).trim())
        .filter(Boolean)
        .slice(0, 20);
    }

    if (typeof req.body?.responded === "boolean") {
      update.responded = req.body.responded;
      update.lastRespondedAt = req.body.responded ? now : null;
    }

    await col.updateOne(
      { phone },
      {
        $setOnInsert: {
          phone,
          createdAt: now,
          lastOpenedAt: null,
          responded: false,
          lastRespondedAt: null,
        },
        $set: update,
      },
      { upsert: true }
    );

    return res.status(200).json({ ok: true });
  }

  return res.status(405).json({ ok: false, error: "method_not_allowed" });
}
