import {
  ENV_LOCAL,
  ensureAccessSecret,
  ensureBaselineEnv,
  ensureEnvLocal,
  getEnvValue,
  isPlaceholderValue,
  readEnvFile,
  upsertEnvValue,
  writeEnvLocal,
} from "./lib/env-file.mjs";

function main() {
  ensureEnvLocal();

  if (!readEnvFile(ENV_LOCAL)) {
    console.error("No .env.local found. Run: npm run setup");
    process.exit(1);
  }

  let content = readEnvFile(ENV_LOCAL);
  content = ensureBaselineEnv(content);

  const { content: next, changed } = ensureAccessSecret(content);
  writeEnvLocal(next);

  if (changed) {
    console.log("Generated DIAGNOSTIC_ACCESS_SECRET and saved it to .env.local");
  } else {
    console.log("DIAGNOSTIC_ACCESS_SECRET already set — leaving it unchanged.");
  }
}

main();
