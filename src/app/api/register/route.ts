import { createClient } from "next-sanity";
import { isMoroccanCity, MOROCCAN_LOCATIONS } from "@/constants/locations";

type RegistrationRole = "client" | "craftsman";

type RegistrationPayload = {
  name?: unknown;
  service?: unknown;
  email?: unknown;
  phone?: unknown;
  whatsapp?: unknown;
  whatsappMessage?: unknown;
  city?: unknown;
  district?: unknown;
  bio?: unknown;
  role?: unknown;
};

const MAX_LENGTHS = {
  name: 120,
  service: 128,
  email: 254,
  phone: 40,
  whatsapp: 20,
  whatsappMessage: 500,
  city: 100,
  district: 120,
  bio: 2000,
} as const;

function isRecord(value: unknown): value is RegistrationPayload {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function readOptionalText(
  value: unknown,
  field: keyof typeof MAX_LENGTHS,
): string | null {
  if (value === undefined || value === null || value === "") {
    return "";
  }

  if (typeof value !== "string") {
    return null;
  }

  const text = value.trim();
  return text.length <= MAX_LENGTHS[field] ? text : null;
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
    return Response.json({ error: "بيانات التسجيل غير صالحة." }, { status: 400 });
  }

  const name = readOptionalText(payload.name, "name");
  const serviceId = readOptionalText(payload.service, "service");
  const email = readOptionalText(payload.email, "email");
  const phone = readOptionalText(payload.phone, "phone");
  const whatsapp = readOptionalText(payload.whatsapp, "whatsapp");
  const whatsappMessage = readOptionalText(payload.whatsappMessage, "whatsappMessage");
  const city = readOptionalText(payload.city, "city");
  const district = readOptionalText(payload.district, "district");
  const bio = readOptionalText(payload.bio, "bio");

  if (name === null || !name) {
    return Response.json({ error: "الاسم مطلوب ويجب ألا يتجاوز 120 حرفاً." }, { status: 400 });
  }

  if (serviceId === null) {
    return Response.json({ error: "الخدمة المختارة غير صالحة." }, { status: 400 });
  }

  if (email === null || (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
    return Response.json({ error: "يرجى إدخال بريد إلكتروني صالح." }, { status: 400 });
  }

  if (phone === null || (phone && !/^[+\d\s().-]+$/.test(phone))) {
    return Response.json({ error: "رقم الهاتف غير صالح." }, { status: 400 });
  }

  if (
    whatsapp === null ||
    (whatsapp &&
      (!/^\+\d[\d\s().-]*$/.test(whatsapp) ||
        whatsapp.replace(/\D/g, "").length < 8 ||
        whatsapp.replace(/\D/g, "").length > 15))
  ) {
    return Response.json(
      { error: "رقم واتساب غير صالح. أدخله مع رمز الدولة، مثل +212600000000." },
      { status: 400 },
    );
  }

  if (
    whatsappMessage === null ||
    city === null ||
    district === null ||
    bio === null
  ) {
    return Response.json({ error: "بعض الحقول تتجاوز الحد المسموح." }, { status: 400 });
  }

  if (city && !isMoroccanCity(city)) {
    return Response.json({ error: "يرجى اختيار مدينة من القائمة." }, { status: 400 });
  }

  if (city && !district) {
    return Response.json({ error: "يرجى اختيار المقاطعة أو الحي." }, { status: 400 });
  }

  if (
    district &&
    (!city ||
      !isMoroccanCity(city) ||
      !MOROCCAN_LOCATIONS[city].some((validDistrict) => validDistrict === district))
  ) {
    return Response.json(
      { error: "يرجى اختيار مقاطعة أو حي تابع للمدينة المحددة." },
      { status: 400 },
    );
  }

  let role: RegistrationRole;
  if (payload.role === undefined || payload.role === "craftsman") {
    role = "craftsman";
  } else if (payload.role === "client") {
    role = "client";
  } else {
    return Response.json({ error: "نوع الحساب غير صالح." }, { status: 400 });
  }

  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
  const token = process.env.SANITY_API_WRITE_TOKEN;

  if (!projectId || !dataset || !token) {
    console.error("Registration is unavailable: Sanity write configuration is missing.");
    return Response.json(
      { error: "التسجيل غير متاح حالياً. يرجى المحاولة لاحقاً." },
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
    if (serviceId && role !== "craftsman") {
      return Response.json(
        { error: "اختيار الخدمة متاح لحسابات الحرفيين فقط." },
        { status: 400 },
      );
    }

    if (
      serviceId &&
      !(await client.fetch<string | null>(
        '*[_type == "service" && _id == $serviceId][0]._id',
        { serviceId },
      ))
    ) {
      return Response.json(
        { error: "الخدمة المختارة غير موجودة. حدّث الصفحة واختر خدمة متاحة." },
        { status: 400 },
      );
    }

    const user = await client.create({
      _type: "user",
      name,
      email: email.toLowerCase(),
      phone,
      whatsapp,
      whatsappMessage,
      city,
      district,
      bio,
      role,
      ...(serviceId
        ? { service: { _type: "reference" as const, _ref: serviceId } }
        : {}),
      isVerified: false,
    });

    return Response.json(
      {
        success: true,
        id: user._id,
        message: "تم استلام طلبك، وهو قيد المراجعة.",
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Failed to create a Sanity registration document.", error);
    return Response.json(
      { error: "تعذر إتمام التسجيل حالياً. يرجى المحاولة لاحقاً." },
      { status: 500 },
    );
  }
}
