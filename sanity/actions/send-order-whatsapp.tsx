import { useState } from "react";
import { useClient, type DocumentActionComponent } from "sanity";

type WhatsAppDetails = {
  serviceName: string | null;
  craftsmanWhatsapp: string | null;
};

function getReferenceId(value: unknown): string | null {
  if (
    typeof value === "object" &&
    value !== null &&
    "_ref" in value &&
    typeof value._ref === "string"
  ) {
    return value._ref;
  }

  return null;
}

export const SendOrderWhatsAppAction: DocumentActionComponent = ({
  draft,
  published,
  onComplete,
}) => {
  const client = useClient({ apiVersion: "2026-11-06" }).withConfig({
    useCdn: false,
  });
  const [isSending, setIsSending] = useState(false);
  const order = draft ?? published;
  const serviceTypeId = getReferenceId(order?.serviceType);
  const craftsmanId = getReferenceId(order?.assignedCraftsman);
  const isApproved = order?.isApproved === true;

  return {
    label: isSending ? "جارٍ فتح واتساب..." : "إرسال الطلب عبر واتساب",
    disabled: !isApproved || !serviceTypeId || !craftsmanId || isSending,
    onHandle: async () => {
      const whatsappWindow = window.open("about:blank", "_blank");
      if (!whatsappWindow) {
        window.alert("يرجى السماح بالنوافذ المنبثقة لإرسال الطلب عبر واتساب.");
        return;
      }
      whatsappWindow.opener = null;
      setIsSending(true);

      try {
        const details = await client.fetch<WhatsAppDetails>(
          `{
            "serviceName": *[_type == "service" && _id == $serviceTypeId][0].title,
            "craftsmanWhatsapp": *[_type == "user" && _id == $craftsmanId][0].whatsapp
          }`,
          { serviceTypeId, craftsmanId },
        );
        const whatsappNumber = details.craftsmanWhatsapp?.replace(/\D/g, "") ?? "";

        if (
          !details.serviceName ||
          !whatsappNumber ||
          whatsappNumber.length < 8 ||
          whatsappNumber.length > 15
        ) {
          throw new Error(
            "تعذر إرسال الطلب. تحقق من الخدمة ورقم واتساب المسجل للحرفي.",
          );
        }

        const message = [
          "السلام عليكم، لدي طلب خدمة جديد.",
          `اسم العميل: ${typeof order?.clientName === "string" ? order.clientName : ""}`,
          `رقم الهاتف: ${typeof order?.clientPhone === "string" ? order.clientPhone : ""}`,
          `نوع الخدمة: ${details.serviceName}`,
          `تفاصيل الخدمة: ${typeof order?.problemDescription === "string" ? order.problemDescription : ""}`,
        ].join("\n");

        whatsappWindow.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
        onComplete();
      } catch (error) {
        whatsappWindow.close();
        console.error("Failed to prepare the order WhatsApp message.", error);
        window.alert(
          error instanceof Error
            ? error.message
            : "تعذر إعداد رسالة واتساب للطلب.",
        );
      } finally {
        setIsSending(false);
      }
    },
  };
};
