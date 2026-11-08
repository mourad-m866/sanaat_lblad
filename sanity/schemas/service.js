import { defineField, defineType } from "sanity";

export default defineType({
  name: "service",
  title: "الخدمات",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "اسم الخدمة أو الحرفة",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      title: "الرابط",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "icon",
      title: "أيقونة الخدمة",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({ name: "description", title: "وصف الخدمة", type: "text" }),
    defineField({
      name: "isFeatured",
      title: "عرض في الصفحة الرئيسية",
      type: "boolean",
      initialValue: true,
    }),
  ],
  preview: {
    select: { title: "title", media: "icon" },
  },
});
