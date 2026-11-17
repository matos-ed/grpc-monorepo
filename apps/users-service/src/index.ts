import { startUsersService } from './app';
import { loadConfig } from './config';

const config = loadConfig();
await startUsersService({ port: config.port });
