const PRODUCT_HUNT_URL =
  "https://www.producthunt.com/products/revenue-leak?embed=true&utm_source=badge-featured&utm_medium=badge&utm_campaign=badge-revenue-leak";

const PRODUCT_HUNT_BADGE_SRC =
  "https://api.producthunt.com/widgets/embed-image/v1/featured.svg?post_id=1182574&theme=light&t=1782585963817";

export function ProductHuntBadge() {
  if (process.env.NEXT_PUBLIC_PRODUCT_HUNT_ENABLED === "false") {
    return null;
  }

  return (
    <a
      href={PRODUCT_HUNT_URL}
      target="_blank"
      rel="noopener noreferrer"
      className="mx-auto mb-6 inline-block"
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        alt="Revenue Leak - Find where your business is leaking revenue in 5 minutes | Product Hunt"
        width={250}
        height={54}
        src={PRODUCT_HUNT_BADGE_SRC}
      />
    </a>
  );
}
