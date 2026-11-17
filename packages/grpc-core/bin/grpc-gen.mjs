#!/usr/bin/env node
import { spawnSync } from 'node:child_process';
import { createRequire } from 'node:module';

// Must stay in sync with LOADER_OPTIONS in src/proto.ts, or the generated types lie.
const GEN_FLAGS = [
  '--grpcLib=@grpc/grpc-js',
  '--longs=String',
  '--enums=String',
  '--defaults',
  '--oneofs',
  '--inputTemplate=%sInput',
  '--outputTemplate=%s',
];

const USAGE = 'usage: grpc-gen [--outDir=src/generated] <file.proto>...';

const args = process.argv.slice(2);
const protoFiles = args.filter((arg) => !arg.startsWith('--'));
const outDir = args.find((arg) => arg.startsWith('--outDir='))?.slice('--outDir='.length) ?? 'src/generated';

if (protoFiles.length === 0) {
  process.stderr.write(`${USAGE}\n`);
  process.exit(1);
}

const require = createRequire(import.meta.url);
const generator = require.resolve('@grpc/proto-loader/build/bin/proto-loader-gen-types.js');

const result = spawnSync(
  process.execPath,
  [generator, ...GEN_FLAGS, `--outDir=${outDir}`, ...protoFiles],
  { stdio: 'inherit' },
);

if (result.error) {
  process.stderr.write(`grpc-gen: ${result.error.message}\n`);
  process.exit(1);
}
process.exit(result.status ?? 1);
