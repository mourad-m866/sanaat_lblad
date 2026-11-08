import { defineField, defineType } from "sanity";

export default defineType({
  name: "order",
  title: "الطلبات",
  type: "document",
  fields: [
    defineField({
      name: "orderNumber",
      title: "رقم الطلب",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "client",
      title: "العميل",
      type: "reference",
      to: [{ type: "user" }],
      options: {
        filter: "role == $role",
        filterParams: { role: "client" },
      },
    }),
    defineField({
      name: "serviceType",
      title: "الخدمة",
      type: "reference",
      to: [{ type: "service" }],
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "assignedCraftsman",
      title: "الحرفي المكلّف",
      type: "reference",
      to: [{ type: "user" }],
      options: {
        filter: "role == $role",
        filterParams: { role: "craftsman" },
      },
    }),
    defineField({
      name: "status",
      title: "حالة الطلب",
      type: "string",
      options: {
        list: [
          { title: "جديد", value: "new" },
          { title: "قيد التنفيذ", value: "in_progress" },
          { title: "مكتمل", value: "completed" },
          { title: "ملغى", value: "canceled" },
        ],
        layout: "radio",
      },
      initialValue: "new",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "problemDescription",
      title: "وصف المشكلة أو الطلب",
      type: "text",
      validation: (rule) => rule.required(),
    }),
  ],
  preview: {
    select: { title: "orderNumber", subtitle: "status" },
  },
});
