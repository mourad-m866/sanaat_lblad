import { defineArrayMember, defineField, defineType } from "sanity";

export default defineType({
  name: "user",
  title: "المستخدمون",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "الاسم الكامل",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "email",
      title: "البريد الإلكتروني",
      type: "string",
    }),
    defineField({
      name: "phone",
      title: "رقم الهاتف",
      type: "string",
    }),
    defineField({
      name: "whatsapp",
      title: "رقم واتساب",
      description: "أدخل الرقم مع رمز الدولة، مثل +212600000000.",
      type: "string",
      validation: (rule) => rule.max(20),
    }),
    defineField({
      name: "whatsappMessage",
      title: "رسالة واتساب التلقائية",
      type: "string",
      validation: (rule) => rule.max(500),
    }),
    defineField({
      name: "role",
      title: "الدور",
      type: "string",
      options: {
        list: [
          { title: "عميل", value: "client" },
          { title: "حرفي", value: "craftsman" },
          { title: "مدير", value: "admin" },
        ],
        layout: "radio",
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "city",
      title: "المدينة",
      type: "string",
      options: {
        list: [
          { title: "الدار البيضاء", value: "الدار البيضاء" },
          { title: "الرباط", value: "الرباط" },
          { title: "مراكش", value: "مراكش" },
          { title: "فاس", value: "فاس" },
          { title: "طنجة", value: "طنجة" },
          { title: "أكادير", value: "أكادير" },
          { title: "مكناس", value: "مكناس" },
          { title: "وجدة", value: "وجدة" },
          { title: "سلا", value: "سلا" },
          { title: "تطوان", value: "تطوان" },
        ],
      },
    }),
    defineField({
      name: "district",
      title: "المقاطعة أو الحي",
      type: "string",
      validation: (rule) => rule.max(120),
    }),
    defineField({
      name: "bio",
      title: "نبذة عن الخبرة",
      type: "text",
    }),
    defineField({
      name: "rating",
      title: "التقييم",
      type: "number",
      validation: (rule) => rule.min(1).max(5),
    }),
    defineField({
      name: "isVerified",
      title: "حساب مفعل",
      type: "boolean",
      initialValue: false,
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "service",
      title: "الحرفة أو الخدمة الأساسية",
      type: "reference",
      to: [{ type: "service" }],
      hidden: ({ parent }) => parent?.role !== "craftsman",
    }),
    defineField({
      name: "services",
      title: "الخدمات التي يقدمها",
      type: "array",
      of: [
        defineArrayMember({
          type: "reference",
          to: [{ type: "service" }],
        }),
      ],
      hidden: ({ parent }) => parent?.role !== "craftsman",
    }),
    defineField({
      name: "portfolio",
      title: "معرض الأعمال",
      type: "array",
      of: [
        defineArrayMember({
          type: "image",
          options: { hotspot: true },
        }),
      ],
    }),
  ],
  preview: {
    select: { title: "name", subtitle: "city" },
  },
});
