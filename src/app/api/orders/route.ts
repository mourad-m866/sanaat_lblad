import { randomUUID } from "node:crypto";
import { createClient } from "next-sanity";

type OrderPayload = {
  craftsmanId?: unknown;
  name?: unknown;
  phone?: unknown;
  details?: unknown;
};

const MAX_LENGTHS = {
  craftsmanId: 128,
  name: 120,
  phone: 40,
  details: 2000,
} as const;

function isRecord(value: unknown): value is OrderPayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readText(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text.length > 0 && text.length <= maxLength ? text : null;
}

export async function POST(request: Request) {
  if (!request.headers.get("content-type")?.includes("application/json")) {
    return Response.json({ error: "يجب إرسال البيانات بصيغة JSON." }, { status: 415 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return Response.json({ error: "تعذر قراءة بيانات الطلب." }, { status: 400 });
  }

  if (!isRecord(payload)) {
    return Response.json({ error: "بيانات الطلب غير صالحة." }, { status: 400 });
  }

  const craftsmanId = readText(payload.craftsmanId, MAX_LENGTHS.craftsmanId);
  const name = readText(payload.name, MAX_LENGTHS.name);
  const phone = readText(payload.phone, MAX_LENGTHS.phone);
  const details = readText(payload.details, MAX_LENGTHS.details);

  if (!craftsmanId || !name || !phone || !details) {
    return Response.json(
      { error: "يرجى ملء جميع الحقول بالمعلومات المطلوبة." },
      { status: 400 },
    );
  }

  const phoneDigits = phone.replace(/\D/g, "");
  if (!/^\+?\d[\d\s().-]*$/.test(phone) || phoneDigits.length < 8 || phoneDigits.length > 15) {
    return Response.json({ error: "يرجى إدخال رقم هاتف صالح." }, { status: 400 });
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    console.error("Order submission is unavailable: Sanity write configuration is missing.");
    return Response.json(
      { error: "إرسال الطلبات غير متاح حالياً. يرجى المحاولة لاحقاً." },
      { status: 503 },
    );
  }

  const client = createClient({
    projectId,
    dataset,
    apiVersion: "2026-11-06",
    useCdn: false,
    token,
  });

  try {
    const craftsman = await client.fetch<{ _id: string; name: string } | null>(
      '*[_type == "user" && _id == $craftsmanId && role == "craftsman" && isVerified == true][0]{_id, name}',
      { craftsmanId },
    );

    if (!craftsman) {
      return Response.json({ error: "الحرفي المحدد غير متاح لاستقبال الطلبات." }, { status: 404 });
    }

    const order = await client.create(
      {
        _type: "order",
        orderNumber: `ORD-${Date.now()}-${randomUUID().slice(0, 8).toUpperCase()}`,
        clientName: name,
        clientPhone: phone,
        problemDescription: details,
        assignedCraftsman: { _type: "reference", _ref: craftsman._id },
        status: "pending",
      },
      { returnDocuments: true },
    );

    return Response.json({ success: true, id: order._id }, { status: 201 });
  } catch (error) {
    console.error("Failed to create a Sanity order document.", error);
    return Response.json(
      { error: "تعذر إرسال الطلب حالياً. يرجى المحاولة لاحقاً." },
      { status: 500 },
    );
  }
}
