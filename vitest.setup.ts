import { execSync } from "child_process";

const testDbUrl =
  process.env.TEST_DATABASE_URL?.trim() ||
  "postgresql://postgres:postgres@127.0.0.1:5432/revenue_leak_test";

process.env.DATABASE_URL = testDbUrl;
process.env.DIAGNOSTIC_ACCESS_SECRET = "test-secret-key";
process.env.STRIPE_WEBHOOK_SECRET = "whsec_test_integration_secret";
process.env.STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY ?? "sk_test_integration_fake";
process.env.NEXT_PUBLIC_APP_URL = "http://localhost:3000";
process.env.NURTURE_DELAY_HOURS = "0";

execSync("npx prisma db push --skip-generate", {
  stdio: "ignore",
  env: { ...process.env, DATABASE_URL: testDbUrl },
});
