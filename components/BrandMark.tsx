type BrandMarkProps = {
  className?: string;
};

/** Funnel + drip mark — uses app/icon.svg (same asset as favicon). */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/icon.svg" alt="" className={className} aria-hidden="true" />
  );
}
