import { defineQuery } from "next-sanity";

export const FEATURED_SERVICES_QUERY = defineQuery(`
  *[_type == "service" && isFeatured == true] | order(title asc) {
    _id,
    title,
    "slug": slug.current,
    description,
    "icon": select(
      defined(icon.asset._ref) => icon { asset, hotspot, crop },
      null
    )
  }
`);

export const REGISTRATION_SERVICES_QUERY = defineQuery(`
  *[_type == "service"] | order(title asc) {
    _id,
    title
  }
`);

export const VERIFIED_CRAFTSMEN_QUERY = defineQuery(`
  *[_type == "user" && role == "craftsman" && isVerified == true]
    | order(rating desc) {
      _id,
      name,
      city,
      bio,
      rating,
      phone,
      whatsapp,
      whatsappMessage,
      "service": service->{ _id, title, "slug": slug.current },
      "services": services[]->{ _id, title, "slug": slug.current },
      "portfolio": portfolio[defined(asset._ref)][0] { asset, hotspot, crop }
    }
`);

export const USERS_COUNT_QUERY = defineQuery(`
  count(*[_type == "user"])
`);
