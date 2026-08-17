type BrandMarkProps = {
  className?: string;
};

/** Inline funnel + copper drip mark (matches public/images/revenue-leak-logo.svg). */
export function BrandMark({ className }: BrandMarkProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 32 32"
      className={className}
      aria-hidden="true"
      focusable="false"
    >
      <path fill="#0d9488" d="M4.5 5h23L19 16.5v4h-6v-4L4.5 5z" />
      <path
        fill="#c2410c"
        d="M16 21.5c-2.4 2.6-3.5 4.2-3.5 5.6a3.5 3.5 0 107 0c0-1.4-1.1-3-3.5-5.6z"
      />
    </svg>
  );
}
