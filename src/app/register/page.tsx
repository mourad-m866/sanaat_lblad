import Link from "next/link";
import CraftsmanRegisterForm from "@/components/CraftsmanRegisterForm";
import { cachedSanityFetch } from "@/lib/sanity.live";
import { REGISTRATION_SERVICES_QUERY } from "@/lib/sanity.queries";

type RegistrationService = {
  _id: string;
  title: string;
};

function isRegistrationService(value: unknown): value is RegistrationService {
  return (
    typeof value === "object" &&
    value !== null &&
    "_id" in value &&
    typeof value._id === "string" &&
    "title" in value &&
    typeof value.title === "string"
  );
}

export default async function RegisterPage() {
  const { data: services } = await cachedSanityFetch({
    query: REGISTRATION_SERVICES_QUERY,
    perspective: "published",
    stega: false,
  });
  const registrationServices = Array.isArray(services)
    ? services.filter(isRegistrationService)
    : [];

  return (
    <main className="min-h-screen bg-[#fbfaf7] px-4 py-10 sm:px-6 sm:py-16" dir="rtl">
      <div className="mx-auto mb-8 flex w-full max-w-2xl items-center justify-between">
        <Link className="text-sm font-bold text-[#263d32] hover:text-[#c86d4d]" href="/">
          العودة إلى الرئيسية
        </Link>
        <span className="font-extrabold text-[#263d32]">خِدمات</span>
      </div>
      <CraftsmanRegisterForm services={registrationServices} />
    </main>
  );
}
