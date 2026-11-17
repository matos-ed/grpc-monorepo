import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync, type Options } from '@grpc/proto-loader';
import { fileURLToPath } from 'node:url';

export const PROTO_DIR = fileURLToPath(new URL('../protos', import.meta.url));

// Must stay in sync with the flags of the `gen:types` script, or the generated types lie.
const LOADER_OPTIONS: Options = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
  includeDirs: [PROTO_DIR],
};

export function loadProto<T>(protoPath: string): T {
  const definition = loadSync(protoPath, LOADER_OPTIONS);
  return loadPackageDefinition(definition) as unknown as T;
}
