declare global {
  interface Window {
    _env_?: Record<string, unknown>;
  }
}

function toEnvString(value: unknown): string | undefined {
  if (typeof value === 'string') {
    return value;
  }
  if (typeof value === 'number' || typeof value === 'boolean' || typeof value === 'bigint') {
    return String(value);
  }
  return undefined;
}

export function getEnvValue(key: string): string | undefined {
  const runtimeValue = toEnvString(globalThis.window?._env_?.[key]);
  if (runtimeValue !== undefined) {
    return runtimeValue;
  }

  const processEnv = (globalThis as typeof globalThis & {
    process?: { env?: Record<string, string | undefined> };
  }).process?.env;
  return processEnv?.[key] ?? toEnvString(import.meta.env[key]);
}