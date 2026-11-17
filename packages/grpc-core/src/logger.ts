type LogLevel = 'info' | 'error';
type LogFields = Readonly<Record<string, unknown>>;

const LEVEL_WEIGHT: Readonly<Record<LogLevel | 'silent', number>> = {
  info: 1,
  error: 2,
  silent: 3,
};

function minimumWeight(): number {
  const configured = process.env.LOG_LEVEL;
  if (configured === 'info' || configured === 'error' || configured === 'silent') {
    return LEVEL_WEIGHT[configured];
  }
  return LEVEL_WEIGHT.info;
}

function serialize(_key: string, value: unknown): unknown {
  if (value instanceof Error) {
    return { name: value.name, message: value.message, stack: value.stack };
  }
  return value;
}

function write(level: LogLevel, fields: LogFields, message: string): void {
  if (LEVEL_WEIGHT[level] < minimumWeight()) return;
  const line = JSON.stringify(
    { level, time: new Date().toISOString(), msg: message, ...fields },
    serialize,
  );
  const stream = level === 'error' ? process.stderr : process.stdout;
  stream.write(`${line}\n`);
}

export const logger = {
  info: (fields: LogFields, message: string): void => write('info', fields, message),
  error: (fields: LogFields, message: string): void => write('error', fields, message),
};
