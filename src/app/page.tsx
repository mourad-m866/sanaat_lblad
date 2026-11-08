import { createImageUrlBuilder } from "@sanity/image-url";
import { cachedSanityFetch, sanityClient } from "@/lib/sanity.live";
import {
  FEATURED_SERVICES_QUERY,
  USERS_COUNT_QUERY,
  VERIFIED_CRAFTSMEN_QUERY,
} from "@/lib/sanity.queries";
import HomePage, {
  type CraftsmanCard,
  type ServiceCard,
} from "@/components/home-page";

export default async function Page() {
  const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
  const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;

  if (!projectId || !dataset) {
    return (
      <HomePage
        services={[]}
        craftsmen={[]}
        usersCount={null}
        sanityConfigured={false}
      />
    );
  }

  const { services, craftsmen, usersCount } = await getHomepageData();

  return (
    <HomePage
      services={services}
      craftsmen={craftsmen}
      usersCount={usersCount}
      sanityConfigured
    />
  );
}

async function getHomepageData() {
  const imageBuilder = createImageUrlBuilder(sanityClient);
  const [servicesResult, craftsmenResult, usersCountResult] = await Promise.all([
    cachedSanityFetch({
      query: FEATURED_SERVICES_QUERY,
      perspective: "published",
      stega: false,
    }),
    cachedSanityFetch({
      query: VERIFIED_CRAFTSMEN_QUERY,
      perspective: "published",
      stega: false,
    }),
    cachedSanityFetch({
      query: USERS_COUNT_QUERY,
      perspective: "published",
      stega: false,
    }),
  ]);
  const sanityServices = servicesResult.data as ServiceResult[];
  const sanityCraftsmen = craftsmenResult.data as CraftsmanResult[];
  const usersCount = usersCountResult.data as number;

  const services: ServiceCard[] = sanityServices.map((service) => ({
    _id: service._id,
    title: service.title,
    slug: service.slug,
    description: service.description,
    imageUrl: service.icon
      ? imageBuilder.image(service.icon).width(600).height(440).fit("crop").auto("format").url()
      : null,
  }));

  const craftsmen: CraftsmanCard[] = sanityCraftsmen.map((craftsman) => ({
    _id: craftsman._id,
    name: craftsman.name,
    city: craftsman.city,
    bio: craftsman.bio,
    rating: craftsman.rating,
    phone: craftsman.phone,
    whatsapp: craftsman.whatsapp,
    whatsappMessage: craftsman.whatsappMessage,
    services: [
      ...(craftsman.service ? [craftsman.service] : []),
      ...(craftsman.services?.filter(
      (service): service is NonNullable<typeof service> => service !== null,
      ) ?? []),
    ].filter((service, index, allServices) =>
      allServices.findIndex((item) => item._id === service._id) === index,
    ),
    avatarUrl: craftsman.portfolio
      ? imageBuilder.image(craftsman.portfolio).width(480).height(560).fit("crop").auto("format").url()
      : null,
  }));

  return { services, craftsmen, usersCount };
}

type SanityImage = {
  asset: { _ref: string };
  hotspot?: {
    x: number;
    y: number;
    height: number;
    width: number;
  };
  crop?: {
    top: number;
    bottom: number;
    left: number;
    right: number;
  };
};

type ServiceResult = {
  _id: string;
  title: string;
  slug: string | null;
  description: string | null;
  icon: SanityImage | null;
};

type CraftsmanResult = {
  _id: string;
  name: string;
  city: string | null;
  bio: string | null;
  rating: number | null;
  phone: string | null;
  whatsapp: string | null;
  whatsappMessage: string | null;
  service: { _id: string; title: string; slug: string | null } | null;
  services: ({ _id: string; title: string; slug: string | null } | null)[] | null;
  portfolio: SanityImage | null;
};
