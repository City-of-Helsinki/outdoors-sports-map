import { parse } from 'dotenv';
import { readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { loadEnv } from 'vite';

const { values } = parseArgs({
  options: {
    mode: { type: 'string', default: process.env.NODE_ENV || 'development' },
  },
});

const root = process.cwd();
const defaults = parse(readFileSync(resolve(root, '.env.example')));
const environment = Object.fromEntries(
  Object.entries({ ...defaults, ...loadEnv(values.mode, root, 'REACT_APP_') })
    .filter(([key]) => /^REACT_APP_[A-Z0-9_]+$/.test(key))
);

writeFileSync(
  resolve(root, 'public/env-config.js'),
  `window._env_ = ${JSON.stringify(environment)};\n`
);
writeFileSync(
  resolve(root, '.env.runtime'),
  Object.entries(environment)
    .map(([key, value]) => `${key}=${JSON.stringify(value)}`)
    .join('\n') + '\n'
);