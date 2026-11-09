"use client";

import { useState, type FormEvent } from "react";
import {
  isMoroccanCity,
  MOROCCAN_LOCATIONS,
  type MoroccanCity,
} from "@/constants/locations";

type RegistrationResponse = {
  message?: string;
  error?: string;
};

type RegistrationService = {
  _id: string;
  title: string;
};

const SUCCESS_MESSAGE =
  "تم استلام طلبك بنجاح! طلبك حالياً قيد المراجعة من قبل الإدارة وسنتواصل معك فور التفعيل.";

export default function CraftsmanRegisterForm({
  services,
}: {
  services: RegistrationService[];
}) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [selectedCity, setSelectedCity] = useState<MoroccanCity | "">("");
  const [selectedDistrict, setSelectedDistrict] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    const formData = new FormData(event.currentTarget);
    const payload = {
      name: String(formData.get("name") ?? "").trim(),
      service: String(formData.get("service") ?? "").trim(),
      phone: String(formData.get("phone") ?? "").trim(),
      whatsapp: String(formData.get("whatsapp") ?? "").trim(),
      whatsappMessage: String(formData.get("whatsappMessage") ?? "").trim(),
      email: String(formData.get("email") ?? "").trim(),
      city: String(formData.get("city") ?? "").trim(),
      district: String(formData.get("district") ?? "").trim(),
      bio: String(formData.get("bio") ?? "").trim(),
      role: "craftsman",
    };

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = (await response.json()) as RegistrationResponse;
      if (!response.ok) {
        setErrorMessage(result.error ?? "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.");
        return;
      }

      setSubmitted(true);
    } catch {
      setErrorMessage("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مجدداً.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (submitted) {
    return (
      <section
        aria-labelledby="registration-success-title"
        className="mx-auto w-full max-w-2xl rounded-3xl border border-emerald-200 bg-white p-8 text-center shadow-xl shadow-emerald-950/5 sm:p-12"
        dir="rtl"
        role="status"
      >
        <span className="mx-auto mb-5 grid size-14 place-items-center rounded-full bg-emerald-50 text-2xl text-emerald-700">
          ✓
        </span>
        <h2
          className="text-2xl font-extrabold text-[#263d32] sm:text-3xl"
          id="registration-success-title"
        >
          أهلاً بك في خِدمات
        </h2>
        <p className="mt-4 leading-8 text-[#53584f]">{SUCCESS_MESSAGE}</p>
      </section>
    );
  }

  const inputClassName =
    "mt-2 min-h-12 w-full rounded-xl border border-[#e8e5dd] bg-[#fbfaf7] px-4 py-3 text-sm text-[#20251f] outline-none transition placeholder:text-[#99998f] focus:border-[#c86d4d] focus:ring-4 focus:ring-[#c86d4d]/10 disabled:cursor-not-allowed disabled:opacity-60";

  return (
    <section
      aria-labelledby="craftsman-register-title"
      className="mx-auto w-full max-w-2xl rounded-3xl border border-[#e8e5dd] bg-white p-6 shadow-xl shadow-[#263d32]/8 sm:p-10"
      dir="rtl"
    >
      <div className="mb-8">
        <p className="text-sm font-bold text-[#c86d4d]">خطوتك الأولى نحو فرص جديدة</p>
        <h1
          className="mt-2 text-3xl font-extrabold tracking-tight text-[#263d32] sm:text-4xl"
          id="craftsman-register-title"
        >
          سجّل كحرفي
        </h1>
        <p className="mt-3 leading-7 text-[#77796f]">
          عرّفنا بنفسك وخبرتك، وسيراجع فريقنا طلبك قبل تفعيل حسابك.
        </p>
      </div>

      <form className="space-y-5" onSubmit={handleSubmit}>
        <div className="grid gap-5 sm:grid-cols-2">
          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-name">
            الاسم الكامل <span aria-hidden="true" className="text-red-600">*</span>
            <input
              autoComplete="name"
              className={inputClassName}
              disabled={isSubmitting}
              id="register-name"
              maxLength={120}
              name="name"
              placeholder="مثال: محمد العلوي"
              required
            />
          </label>

          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-phone">
            رقم الهاتف <span aria-hidden="true" className="text-red-600">*</span>
            <input
              autoComplete="tel"
              className={inputClassName}
              disabled={isSubmitting}
              id="register-phone"
              maxLength={40}
              name="phone"
              placeholder="+212 6..."
              required
              type="tel"
            />
          </label>

          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-service">
            الحرفة أو الخدمة الأساسية <span aria-hidden="true" className="text-red-600">*</span>
            <select
              className={`${inputClassName} cursor-pointer appearance-none`}
              defaultValue=""
              disabled={isSubmitting}
              id="register-service"
              name="service"
              required
            >
              <option value="">اختر الخدمة أو الحرفة</option>
              {services.map((service) => (
                <option key={service._id} value={service._id}>
                  {service.title}
                </option>
              ))}
            </select>
            {services.length === 0 && (
              <span className="mt-2 block text-xs font-normal text-[#77796f]">
                لا توجد خدمات منشورة للاختيار حالياً.
              </span>
            )}
          </label>

          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-whatsapp">
            رقم واتساب مع رمز الدولة <span aria-hidden="true" className="text-red-600">*</span>
            <input
              autoComplete="tel"
              className={inputClassName}
              disabled={isSubmitting}
              id="register-whatsapp"
              maxLength={20}
              name="whatsapp"
              placeholder="+212600000000"
              required
              type="tel"
            />
          </label>

          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-email">
            البريد الإلكتروني
            <input
              autoComplete="email"
              className={inputClassName}
              disabled={isSubmitting}
              id="register-email"
              maxLength={254}
              name="email"
              placeholder="name@example.com"
              type="email"
            />
          </label>

          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-city">
            المدينة <span aria-hidden="true" className="text-red-600">*</span>
            <select
              autoComplete="address-level2"
              className={`${inputClassName} cursor-pointer appearance-none`}
              disabled={isSubmitting}
              id="register-city"
              name="city"
              onChange={(event) => {
                const city = event.target.value;
                setSelectedCity(isMoroccanCity(city) ? city : "");
                setSelectedDistrict("");
              }}
              required
              value={selectedCity}
            >
              <option value="">اختر المدينة</option>
              {Object.keys(MOROCCAN_LOCATIONS).map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </label>

          <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-district">
            المقاطعة أو الحي <span aria-hidden="true" className="text-red-600">*</span>
            <select
              autoComplete="address-level3"
              className={`${inputClassName} cursor-pointer appearance-none`}
              disabled={isSubmitting}
              id="register-district"
              name="district"
              onChange={(event) => setSelectedDistrict(event.target.value)}
              required
              value={selectedDistrict}
            >
              <option value="">
                {selectedCity ? "اختر المقاطعة أو الحي" : "اختر المدينة أولاً"}
              </option>
              {selectedCity &&
                MOROCCAN_LOCATIONS[selectedCity].map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
            </select>
          </label>
        </div>

        <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-bio">
          نبذة عن الخبرة أو الحرفة <span aria-hidden="true" className="text-red-600">*</span>
          <textarea
            className={`${inputClassName} min-h-32 resize-y`}
            disabled={isSubmitting}
            id="register-bio"
            maxLength={2000}
            name="bio"
            placeholder="اكتب نبذة قصيرة عن خبرتك والخدمات التي تقدمها..."
            required
            rows={4}
          />
        </label>

        <label className="block text-sm font-bold text-[#343a33]" htmlFor="register-whatsapp-message">
          رسالة واتساب التلقائية (اختياري)
          <input
            className={inputClassName}
            disabled={isSubmitting}
            id="register-whatsapp-message"
            maxLength={500}
            name="whatsappMessage"
            placeholder="السلام عليكم، أريد التواصل معك بخصوص الخدمة."
          />
        </label>

        {errorMessage && (
          <p
            aria-live="polite"
            className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm leading-6 text-red-800"
            role="alert"
          >
            {errorMessage}
          </p>
        )}

        <button
          className="flex min-h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#263d32] px-6 py-3 font-bold text-white transition hover:bg-[#1c3028] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c86d4d] disabled:cursor-wait disabled:opacity-65"
          disabled={isSubmitting}
          type="submit"
        >
          {isSubmitting && (
            <span
              aria-hidden="true"
              className="size-5 animate-spin rounded-full border-2 border-white/40 border-t-white"
            />
          )}
          {isSubmitting ? "جارٍ إرسال الطلب..." : "إرسال طلب التسجيل"}
        </button>
        <p className="text-center text-xs leading-6 text-[#77796f]">
          حسابك لن يظهر في نتائج البحث قبل مراجعة الإدارة وتفعيله.
        </p>
      </form>
    </section>
  );
}
