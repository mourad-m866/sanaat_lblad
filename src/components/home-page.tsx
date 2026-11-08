"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState, type FormEvent } from "react";

export type ServiceCard = {
  _id: string;
  title: string;
  slug: string | null;
  description: string | null;
  imageUrl: string | null;
};

export type CraftsmanCard = {
  _id: string;
  name: string;
  city: string | null;
  bio: string | null;
  rating: number | null;
  phone: string | null;
  whatsapp: string | null;
  whatsappMessage: string | null;
  services: { _id: string; title: string; slug: string | null }[];
  avatarUrl: string | null;
};

type HomePageProps = {
  services: ServiceCard[];
  craftsmen: CraftsmanCard[];
  usersCount: number | null;
  sanityConfigured: boolean;
};

const steps = [
  {
    number: "01",
    title: "اختر الخدمة",
    description: "ابحث عن الحرفة التي تحتاجها وحدد مدينتك.",
    icon: "⌕",
  },
  {
    number: "02",
    title: "تواصل مع حرفي",
    description: "تصفح الملفات والتقييمات وتواصل مباشرة.",
    icon: "↗",
  },
  {
    number: "03",
    title: "أنجز عملك",
    description: "اتفق على التفاصيل ودع حرفياً موثوقاً يتولى المهمة.",
    icon: "✓",
  },
];

function ArrowIcon({ className = "" }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      viewBox="0 0 20 20"
    >
      <path
        d="M4.167 10h11.666m0 0L10 4.167M15.833 10 10 15.833"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.7"
      />
    </svg>
  );
}

function PinIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <path
        d="M16.25 8.333c0 4.167-6.25 9.167-6.25 9.167s-6.25-5-6.25-9.167a6.25 6.25 0 1 1 12.5 0Z"
        stroke="currentColor"
        strokeWidth="1.5"
      />
      <circle cx="10" cy="8.333" r="2.083" stroke="currentColor" strokeWidth="1.5" />
    </svg>
  );
}

function SearchIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 20 20">
      <circle cx="8.75" cy="8.75" r="5.833" stroke="currentColor" strokeWidth="1.7" />
      <path d="m13.125 13.125 3.958 3.958" stroke="currentColor" strokeLinecap="round" strokeWidth="1.7" />
    </svg>
  );
}

function ToolIcon() {
  return (
    <svg aria-hidden="true" fill="none" viewBox="0 0 24 24">
      <path
        d="M14.75 6.25a5 5 0 0 0-6.53 6.53l-5.8 5.8a1.77 1.77 0 0 0 2.5 2.5l5.8-5.8a5 5 0 0 0 6.53-6.53l-3.1 3.1-2.5-2.5 3.1-3.1Z"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.6"
      />
      <path d="m14.75 6.25 3-3 3 3-3 3" stroke="currentColor" strokeLinejoin="round" strokeWidth="1.6" />
    </svg>
  );
}

function getUsersLabel(count: number) {
  switch (new Intl.PluralRules("ar").select(count)) {
    case "zero":
      return "مستخدم مسجل";
    case "one":
      return "مستخدم مسجل";
    case "two":
      return "مستخدمان مسجلان";
    case "few":
      return "مستخدمون مسجلون";
    case "many":
      return "مستخدمًا مسجلًا";
    default:
      return "مستخدم مسجل";
  }
}

function WhatsAppIcon() {
  return (
    <svg aria-hidden="true" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12.04 2a9.87 9.87 0 0 0-8.47 14.94L2 22l5.2-1.36A9.93 9.93 0 1 0 12.04 2Zm0 18.06a8.1 8.1 0 0 1-4.13-1.13l-.3-.18-3.08.8.82-3-.2-.32a8.12 8.12 0 1 1 6.89 3.83Zm4.46-6.08c-.24-.12-1.43-.71-1.65-.79-.22-.08-.38-.12-.54.12-.16.24-.62.79-.76.95-.14.16-.28.18-.52.06-.24-.12-1.02-.38-1.95-1.21-.72-.64-1.2-1.43-1.34-1.67-.14-.24-.02-.37.1-.49.1-.1.24-.28.36-.42.12-.14.16-.24.24-.4.08-.16.04-.3-.02-.42-.06-.12-.54-1.31-.74-1.8-.2-.47-.4-.4-.54-.41h-.46c-.16 0-.42.06-.64.3-.22.24-.84.82-.84 2 0 1.18.86 2.32.98 2.48.12.16 1.69 2.58 4.1 3.62.57.25 1.02.4 1.37.5.58.18 1.1.15 1.51.1.46-.07 1.43-.59 1.63-1.15.2-.57.2-1.05.14-1.15-.06-.1-.22-.16-.46-.28Z" />
    </svg>
  );
}

function WhatsAppContact({
  number,
  message,
}: {
  number: string | null;
  message: string | null;
}) {
  const internationalNumber = (number ?? "").replace(/\D/g, "");
  if (internationalNumber.length < 8 || internationalNumber.length > 15) {
    return null;
  }

  const text = message || "السلام عليكم، أريد التواصل معك بخصوص الخدمة.";

  return (
    <a
      className="contact-button whatsapp-button"
      href={`https://wa.me/${internationalNumber}?text=${encodeURIComponent(text)}`}
      rel="noopener noreferrer"
      target="_blank"
    >
      <WhatsAppIcon />
      تواصل معي عبر الواتساب
    </a>
  );
}

export default function HomePage({
  services,
  craftsmen,
  usersCount,
  sanityConfigured,
}: HomePageProps) {
  const [serviceId, setServiceId] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [activeServiceId, setActiveServiceId] = useState("");
  const [activeCity, setActiveCity] = useState("");

  const cities = useMemo(
    () => [
      ...new Set(
        craftsmen
          .map((craftsman) => craftsman.city)
          .filter((city): city is string => Boolean(city)),
      ),
    ].sort(),
    [craftsmen],
  );

  const visibleCraftsmen = craftsmen.filter((craftsman) => {
    const matchesService =
      !activeServiceId ||
      craftsman.services.some((service) => service._id === activeServiceId);
    const matchesCity =
      !activeCity ||
      (craftsman.city ?? "").toLocaleLowerCase("ar").includes(activeCity.toLocaleLowerCase("ar"));

    return matchesService && matchesCity;
  });

  function applySearch(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setActiveServiceId(serviceId);
    setActiveCity(cityInput.trim());
    document.getElementById("craftsmen")?.scrollIntoView({ behavior: "smooth" });
  }

  function selectService(id: string) {
    setServiceId(id);
    setActiveServiceId(id);
    document.getElementById("search")?.scrollIntoView({ behavior: "smooth" });
  }

  const activeService = services.find((service) => service._id === activeServiceId);

  return (
    <main id="top" className="min-h-screen overflow-hidden bg-[#fbfaf7] text-[#20251f]">
      <header className="site-header">
        <div className="header-inner">
          <Link className="brand" href="/" aria-label="خدمات المغرب - الرئيسية">
            <span className="brand-mark"><ToolIcon /></span>
            <span className="brand-copy">
              <span className="brand-name">خِدمات</span>
              <span className="brand-caption">المغرب بين يديك</span>
            </span>
          </Link>

          <nav className="main-nav" aria-label="التنقل الرئيسي">
            <a href="#services">الخدمات</a>
            <a href="#craftsmen">الحرفيون</a>
            <a href="#how-it-works">كيف نعمل</a>
          </nav>

          <div className="header-actions">
            <Link className="login-link" href="/login">دخول</Link>
            <Link className="button button-dark header-cta" href="/register">
              سجّل كحرفي <ArrowIcon />
            </Link>
          </div>
        </div>
      </header>

      <section className="hero">
        <div className="hero-photo" aria-hidden="true" />
        <div className="hero-overlay" aria-hidden="true" />
        <div className="hero-content">
          <div className="hero-eyebrow"><span /> خدمتك تبدأ من هنا</div>
          <h1>
            لدارك ناسها.
            <br />
            <span>ولكل حاجة،</span> حرفيّها.
          </h1>
          <p className="hero-description">
            نقرّبك من حرفيين مهرة وموثوقين في مدينتك.
            <br className="desktop-break" />
            اختار الخدمة وخلي الباقي علينا.
          </p>
          <div className="hero-proof">
            {usersCount !== null ? (
              <>
                <span className="proof-count">{usersCount.toLocaleString("ar-MA")}</span>
                <span>{getUsersLabel(usersCount)} على خِدمات</span>
              </>
            ) : (
              <span>حرفيون محليون، ثقة من أول زيارة</span>
            )}
            <span className="proof-star" aria-hidden="true">✦</span>
          </div>
        </div>

        <form className="search-panel" id="search" onSubmit={applySearch}>
          <label className="search-field">
            <span className="search-icon"><ToolIcon /></span>
            <span className="field-copy">
              <span className="field-label">شنو محتاج؟</span>
              <select
                aria-label="نوع الخدمة"
                value={serviceId}
                onChange={(event) => setServiceId(event.target.value)}
              >
                <option value="">اختار نوع الخدمة</option>
                {services.map((service) => (
                  <option key={service._id} value={service._id}>{service.title}</option>
                ))}
              </select>
            </span>
          </label>
          <span className="search-divider" aria-hidden="true" />
          <label className="search-field location-field">
            <span className="search-icon"><PinIcon /></span>
            <span className="field-copy">
              <span className="field-label">فين؟</span>
              <input
                aria-label="المدينة أو الموقع"
                list="moroccan-cities"
                onChange={(event) => setCityInput(event.target.value)}
                placeholder="المدينة أو الموقع"
                value={cityInput}
              />
              <datalist id="moroccan-cities">
                {cities.map((city) => <option key={city} value={city} />)}
              </datalist>
            </span>
          </label>
          <button className="button button-terracotta search-button" type="submit">
            <SearchIcon />
            <span>ابحث عن حرفي</span>
          </button>
        </form>

        <div className="hero-bottom-note" aria-hidden="true">
          <span>من طنجة إلى الكويرة</span><span className="note-line" />
        </div>
      </section>

      <section className="section services-section" id="services">
        <div className="section-heading">
          <div>
            <p className="eyebrow">خدمات على قدّ الحاجة</p>
            <h2>شنو نقدروا نعاونك فيه؟</h2>
          </div>
          <a className="text-link" href="#search">كل الخدمات <ArrowIcon /></a>
        </div>

        {!sanityConfigured ? (
          <div className="content-notice" role="status">
            أضف بيانات Sanity إلى ملف <code>.env.local</code> لعرض الخدمات المنشورة.
          </div>
        ) : services.length ? (
          <div className="services-grid">
            {services.map((service, index) => (
              <button
                className={`service-card${serviceId === service._id ? " is-selected" : ""}`}
                key={service._id}
                onClick={() => selectService(service._id)}
                type="button"
              >
                <span className={`service-art service-art-${index % 4}`}>
                  {service.imageUrl ? (
                    <Image
                      alt=""
                      className="service-image"
                      fill
                      sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 220px"
                      src={service.imageUrl}
                      unoptimized
                    />
                  ) : (
                    <span className="service-letter" aria-hidden="true">{service.title.slice(0, 1)}</span>
                  )}
                  <span className="service-arrow"><ArrowIcon /></span>
                </span>
                <span className="service-name">{service.title}</span>
                {service.description && <span className="service-description">{service.description}</span>}
              </button>
            ))}
          </div>
        ) : (
          <div className="empty-state">ما كايناش خدمات منشورة دابا. رجع لينا قريب!</div>
        )}
      </section>

      <section className="craftsmen-section" id="craftsmen">
        <div className="section craftsmen-inner">
          <div className="section-heading craftsmen-heading">
            <div>
              <p className="eyebrow eyebrow-light">أيدي أمينة قريبة منك</p>
              <h2>حرفيون كيعرفو الصنعة</h2>
              <p className="section-subtitle">
                ناس خدامين بضمير، ومختارين بعناية.
              </p>
            </div>
            <a className="text-link text-link-light" href="#search">لقَى الحرفي ديالك <ArrowIcon /></a>
          </div>

          {activeServiceId || activeCity ? (
            <div className="filter-summary">
              <span>
                نتائج البحث
                {activeService ? ` · ${activeService.title}` : ""}
                {activeCity ? ` · ${activeCity}` : ""}
              </span>
              <button
                onClick={() => {
                  setActiveServiceId("");
                  setActiveCity("");
                  setServiceId("");
                  setCityInput("");
                }}
                type="button"
              >
                مسح التصفية
              </button>
            </div>
          ) : null}

          {!sanityConfigured ? (
            <div className="content-notice content-notice-dark" role="status">
              أضف إعدادات Sanity لعرض الحرفيين المعتمدين.
            </div>
          ) : visibleCraftsmen.length ? (
            <div className="craftsmen-grid">
              {visibleCraftsmen.map((craftsman) => (
                <article className="craftsman-card" key={craftsman._id}>
                  <div className="craftsman-photo">
                    {craftsman.avatarUrl ? (
                      <Image
                        alt={craftsman.name}
                        className="craftsman-image"
                        fill
                        sizes="(max-width: 640px) 90vw, (max-width: 1024px) 45vw, 340px"
                        src={craftsman.avatarUrl}
                        unoptimized
                      />
                    ) : (
                      <span className="craftsman-initial" aria-hidden="true">
                        {craftsman.name.slice(0, 1)}
                      </span>
                    )}
                    <span className="verified-badge"><span>✓</span> موثّق</span>
                  </div>
                  <div className="craftsman-details">
                    <WhatsAppContact
                      message={craftsman.whatsappMessage}
                      number={craftsman.whatsapp}
                    />
                    <div className="craftsman-title-row">
                      <div>
                        <h3>{craftsman.name}</h3>
                        {craftsman.city && (
                          <span className="craftsman-city"><PinIcon />{craftsman.city}</span>
                        )}
                      </div>
                      <span className="rating"><span aria-hidden="true">★</span> {craftsman.rating?.toFixed(1) ?? "جديد"}</span>
                    </div>
                    {craftsman.bio && <p className="craftsman-bio">{craftsman.bio}</p>}
                    <div className="craftsman-tags">
                      {craftsman.services.slice(0, 2).map((service) => (
                        <span key={service._id}>{service.title}</span>
                      ))}
                    </div>
                    {craftsman.phone && (
                      <a className="contact-button" href={`tel:${craftsman.phone.replace(/[^\d+]/g, "")}`}>
                        تواصل مع الحرفي <ArrowIcon />
                      </a>
                    )}
                  </div>
                </article>
              ))}
            </div>
          ) : (
            <div className="empty-state empty-state-dark">
              {craftsmen.length
                ? "ما لقيناش حرفيين بهاد المواصفات. جرب مدينة أو خدمة أخرى."
                : "الحرفيون المعتمدون غادي يبانوا هنا قريباً."}
            </div>
          )}
        </div>
      </section>

      <section className="section how-section" id="how-it-works">
        <div className="how-intro">
          <p className="eyebrow">بلا تعقيد، بلا دوخة</p>
          <h2>من الطلب حتى الإنجاز،<br /><span>ثلاث خطوات بسيطة.</span></h2>
          <p>لقَى الشخص المناسب لخدمتك، بكل سهولة وبكل ثقة.</p>
        </div>
        <div className="steps-grid">
          {steps.map((step) => (
            <article className="step-card" key={step.number}>
              <div className="step-topline">
                <span className="step-number">{step.number}</span>
                <span className="step-icon" aria-hidden="true">{step.icon}</span>
              </div>
              <h3>{step.title}</h3>
              <p>{step.description}</p>
            </article>
          ))}
        </div>
        <a className="button button-dark how-cta" href="#search">
          يلا نبدأو <ArrowIcon />
        </a>
      </section>

      <footer className="site-footer">
        <div className="footer-main">
          <Link className="brand footer-brand" href="/">
            <span className="brand-mark"><ToolIcon /></span>
            <span className="brand-copy">
              <span className="brand-name">خِدمات</span>
              <span className="brand-caption">المغرب بين يديك</span>
            </span>
          </Link>
          <p>حرفيّك، من حومتك.<br />خدمات موثوقة لكل دار مغربية.</p>
          <a className="footer-top-link" href="#top" onClick={(event) => {
            event.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}>
            <span>↑</span> رجع للفوق
          </a>
        </div>
        <div className="footer-bottom">
          <span>© خِدمات. جميع الحقوق محفوظة.</span>
          <span>صُنع بكل محبة في المغرب <span aria-hidden="true">♥</span></span>
        </div>
      </footer>
    </main>
  );
}
