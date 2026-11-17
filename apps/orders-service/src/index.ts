import { startOrdersService } from './app';
import { loadConfig } from './config';

const config = loadConfig();
await startOrdersService({ port: config.port, usersAddress: config.usersAddress });
