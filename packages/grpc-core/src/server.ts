import {
  Server,
  ServerCredentials,
  type ServiceDefinition,
  type UntypedServiceImplementation,
} from '@grpc/grpc-js';
import { logger } from './logger';

const DEFAULT_SHUTDOWN_TIMEOUT_MS = 5_000;

export interface IServiceRegistration {
  readonly definition: ServiceDefinition;
  readonly implementation: UntypedServiceImplementation;
}

export interface IServerOptions {
  readonly name: string;
  readonly port: number;
  readonly host?: string;
  readonly services: readonly IServiceRegistration[];
  readonly shutdownTimeoutMs?: number;
  /** Install SIGINT/SIGTERM handlers that shut down and exit the process. Disable in tests. */
  readonly handleSignals?: boolean;
  /** Runs after the server stops accepting calls, e.g. to close outbound clients. */
  readonly onShutdown?: () => void | Promise<void>;
}

export interface IRunningServer {
  /** The bound port; differs from the requested one when `port` is 0. */
  readonly port: number;
  shutdown(): Promise<void>;
}

function bind(server: Server, address: string): Promise<number> {
  return new Promise((resolve, reject) => {
    server.bindAsync(address, ServerCredentials.createInsecure(), (error, port) => {
      if (error) reject(error);
      else resolve(port);
    });
  });
}

function stop(server: Server, timeoutMs: number): Promise<void> {
  return new Promise((resolve) => {
    const timer = setTimeout(() => {
      logger.error({ timeoutMs }, 'graceful shutdown timed out, forcing');
      server.forceShutdown();
      resolve();
    }, timeoutMs);
    timer.unref();

    server.tryShutdown((error) => {
      clearTimeout(timer);
      if (error) {
        logger.error({ err: error }, 'graceful shutdown failed, forcing');
        server.forceShutdown();
      }
      resolve();
    });
  });
}

export async function startServer(options: IServerOptions): Promise<IRunningServer> {
  const {
    name,
    host = '0.0.0.0',
    shutdownTimeoutMs = DEFAULT_SHUTDOWN_TIMEOUT_MS,
    handleSignals = true,
  } = options;

  const server = new Server();
  for (const { definition, implementation } of options.services) {
    server.addService(definition, implementation);
  }

  const port = await bind(server, `${host}:${options.port}`);
  logger.info({ service: name, host, port }, 'gRPC server listening');

  let closing: Promise<void> | undefined;
  const shutdown = (): Promise<void> => {
    closing ??= (async () => {
      await stop(server, shutdownTimeoutMs);
      await options.onShutdown?.();
      logger.info({ service: name }, 'gRPC server stopped');
    })();
    return closing;
  };

  if (handleSignals) {
    for (const signal of ['SIGINT', 'SIGTERM'] as const) {
      process.once(signal, () => {
        logger.info({ service: name, signal }, 'shutting down');
        shutdown().then(
          () => process.exit(0),
          (error: unknown) => {
            logger.error({ service: name, err: error }, 'shutdown failed');
            process.exit(1);
          },
        );
      });
    }
  }

  return { port, shutdown };
}
