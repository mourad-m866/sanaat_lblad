This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Sanity

Copy `.env.example` to `.env.local` and replace the placeholder values with your
Sanity project ID and dataset. Registration and order submissions also require a
Sanity API token with permission to create documents:

```env
NEXT_PUBLIC_SANITY_PROJECT_ID=your-sanity-project-id
NEXT_PUBLIC_SANITY_DATASET=production
SANITY_API_WRITE_TOKEN=your-server-side-sanity-write-token
```

The configured `sanityClient` is exported from `sanity.client.ts`. Restart the
development server after changing environment variables.

For the deployed site, add `SANITY_API_WRITE_TOKEN` to the Vercel project's
Environment Variables for the relevant environment, then redeploy. Keep it
server-side: do not prefix it with `NEXT_PUBLIC_` or commit its value. If
submissions still fail, check the Vercel Function logs for the Sanity API error
and confirm the token has write access to the configured project and dataset.

The Sanity Studio schemas are in `sanity/schemas/`. Run `npm run studio` to
open the Studio at `http://localhost:3333/studio`.

Craftsman identity documents are modeled as files. Keep the Sanity dataset
private and do not expose credentials or unrestricted document access to
browser clients when storing identity documents or personal information.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
