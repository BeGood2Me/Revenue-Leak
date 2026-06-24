export function isPlaceholderStripeValue(value: string | undefined): boolean {
  if (!value) return true;
  const v = value.trim().toLowerCase();
  return (
    v.includes("placeholder") ||
    v.includes("your_") ||
    v.endsWith("...") ||
    v === "sk_test_..." ||
    v === "pk_test_..." ||
    v === "whsec_..." ||
    v === "price_..."
  );
}

export function getStripeConfigErrors(): string[] {
  const errors: string[] = [];

  if (isPlaceholderStripeValue(process.env.STRIPE_SECRET_KEY)) {
    errors.push(
      "STRIPE_SECRET_KEY is missing or still a placeholder. Run `npm run stripe:setup` or copy your test secret key from https://dashboard.stripe.com/test/apikeys"
    );
  }

  if (isPlaceholderStripeValue(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)) {
    errors.push(
      "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY is missing or still a placeholder."
    );
  }

  return errors;
}

export function getStripeUserMessage(error: unknown): string {
  if (error && typeof error === "object" && "type" in error) {
    const stripeError = error as { type?: string; message?: string };
    if (stripeError.type === "StripeAuthenticationError") {
      return "Stripe API key is invalid. Run `npm run stripe:setup` or update STRIPE_SECRET_KEY in .env.local, then restart `npm run dev`.";
    }
    if (stripeError.message) {
      return stripeError.message;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "Failed to create checkout session";
}
