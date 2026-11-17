import { loadPackageDefinition } from '@grpc/grpc-js';
import { loadSync, type Options } from '@grpc/proto-loader';
import { fileURLToPath } from 'node:url';

// Must stay in sync with GEN_FLAGS in bin/grpc-gen.mjs, or the generated types lie.
const LOADER_OPTIONS: Options = {
  keepCase: false,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
};

export interface ILoadProtoOptions {
  /** Directories searched for the .proto files that `protoFile` imports. */
  readonly includeDirs?: readonly string[];
}

/**
 * Loads a .proto file and returns its package tree, typed with the `ProtoGrpcType`
 * that `grpc-gen` generated for it. Pass a URL built from `import.meta.url` so the
 * path resolves from the calling package, not from the process cwd.
 */
export function loadProto<T>(protoFile: string | URL, options: ILoadProtoOptions = {}): T {
  const path = protoFile instanceof URL ? fileURLToPath(protoFile) : protoFile;
  const definition = loadSync(path, { ...LOADER_OPTIONS, includeDirs: [...(options.includeDirs ?? [])] });
  return loadPackageDefinition(definition) as unknown as T;
}
