"use client";

import { useEffect, useState, type FormEvent } from "react";

type OrderModalProps = {
  craftsmanId: string;
  craftsmanName: string;
  onClose: () => void;
};

export default function OrderModal({
  craftsmanId,
  craftsmanName,
  onClose,
}: OrderModalProps) {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !isSubmitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isSubmitting, onClose]);

  async function submitOrder(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ craftsmanId, name, phone, details }),
      });
      const result: unknown = await response.json();

      if (
        !response.ok ||
        typeof result !== "object" ||
        result === null ||
        !("success" in result) ||
        result.success !== true
      ) {
        const message =
          typeof result === "object" &&
          result !== null &&
          "error" in result &&
          typeof result.error === "string"
            ? result.error
            : "تعذر إرسال الطلب. يرجى المحاولة مرة أخرى.";
        setError(message);
        return;
      }

      setIsSubmitted(true);
    } catch {
      setError("تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="order-modal-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget && !isSubmitting) {
          onClose();
        }
      }}
    >
      <section
        aria-labelledby="order-modal-title"
        aria-modal="true"
        className="order-modal"
        dir="rtl"
        role="dialog"
      >
        <button
          aria-label="إغلاق النافذة"
          className="order-modal-close"
          disabled={isSubmitting}
          onClick={onClose}
          type="button"
        >
          ×
        </button>
        {isSubmitted ? (
          <div className="order-modal-success" role="status">
            <h2 id="order-modal-title">تم إرسال طلبك بنجاح</h2>
            <p>سيتواصل معك {craftsmanName} بخصوص الخدمة قريباً.</p>
            <button className="button button-dark" onClick={onClose} type="button">
              حسناً
            </button>
          </div>
        ) : (
          <>
            <p className="eyebrow">طلب خدمة من {craftsmanName}</p>
            <h2 id="order-modal-title">شنو الخدمة اللي محتاج؟</h2>
            <form className="order-modal-form" onSubmit={submitOrder}>
              <label>
                <span>الاسم الكامل</span>
                <input
                  autoComplete="name"
                  autoFocus
                  maxLength={120}
                  onChange={(event) => setName(event.target.value)}
                  required
                  value={name}
                />
              </label>
              <label>
                <span>رقم الهاتف</span>
                <input
                  autoComplete="tel"
                  inputMode="tel"
                  maxLength={40}
                  onChange={(event) => setPhone(event.target.value)}
                  required
                  value={phone}
                />
              </label>
              <label>
                <span>تفاصيل الخدمة المطلوبة</span>
                <textarea
                  maxLength={2000}
                  onChange={(event) => setDetails(event.target.value)}
                  required
                  rows={4}
                  value={details}
                />
              </label>
              {error && (
                <p className="order-modal-error" role="alert">
                  {error}
                </p>
              )}
              <button
                className="button button-terracotta order-modal-submit"
                disabled={isSubmitting}
                type="submit"
              >
                {isSubmitting ? "جارٍ إرسال الطلب..." : "إرسال الطلب"}
              </button>
            </form>
          </>
        )}
      </section>
    </div>
  );
}
