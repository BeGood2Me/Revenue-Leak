import { spawn, spawnSync } from "child_process";

function quoteArg(arg) {
  if (!/[\s"]/u.test(arg)) return arg;
  return `"${arg.replace(/"/g, '\\"')}"`;
}

function runCommand(command, args, { stdio = "inherit" } = {}) {
  if (process.platform === "win32") {
    const line = [command, ...args].map(quoteArg).join(" ");
    const result = spawnSync("cmd.exe", ["/d", "/s", "/c", line], {
      encoding: "utf8",
      stdio,
      shell: false,
      windowsHide: true,
    });

    if (result.error) throw result.error;
    if (result.status !== 0) {
      throw new Error(
        result.stderr?.trim() ||
          result.stdout?.trim() ||
          `${line} failed`
      );
    }
    return result;
  }

  const result = spawnSync(command, args, {
    encoding: "utf8",
    stdio,
    shell: false,
    windowsHide: true,
  });

  if (result.error) throw result.error;
  if (result.status !== 0) {
    throw new Error(
      result.stderr?.trim() ||
        result.stdout?.trim() ||
        `${command} ${args.join(" ")} failed`
    );
  }

  return result;
}

export function runNpx(args, options) {
  return runCommand("npx", args, options);
}

export function spawnExecutable(file, args, options = {}) {
  if (process.platform === "win32") {
    const line = [file, ...args].map(quoteArg).join(" ");
    return spawn("cmd.exe", ["/d", "/s", "/c", line], {
      shell: false,
      windowsHide: true,
      ...options,
    });
  }

  return spawn(file, args, {
    shell: false,
    windowsHide: true,
    ...options,
  });
}

export function spawnSyncExecutable(file, args, options = {}) {
  return runCommand(file, args, options);
}
