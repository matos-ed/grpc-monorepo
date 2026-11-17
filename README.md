# grpc-monorepo

Monorepo pnpm com dois serviços Node.js (TypeScript) que se comunicam via gRPC e uma lib compartilhada com o setup base.

```
packages/grpc-core      # lib: contratos .proto, tipos gerados, server/client, erros, logger
apps/users-service      # gRPC UserService (porta 50051)
apps/orders-service     # gRPC OrderService (porta 50052), chama o users-service via gRPC
```

```
demo ──CreateOrder──▶ orders-service ──GetUser──▶ users-service
```

## Requisitos

- Node 22 (`.nvmrc`)
- pnpm via corepack: `corepack enable` (a versão fica fixada em `packageManager`)

## Comandos

| comando | o que faz |
|---|---|
| `pnpm install` | instala as dependências do workspace |
| `pnpm dev` | sobe os dois serviços em modo watch |
| `pnpm demo [userId]` | cria e busca um pedido no orders-service (padrão `u-1`; usuários seed: `u-1`, `u-2`, `u-3`) |
| `pnpm test` | testes unitários e de integração (vitest) |
| `pnpm typecheck` | `tsc` em todos os pacotes |
| `pnpm gen` | regenera os tipos TS a partir dos `.proto` |

## Variáveis de ambiente

| variável | padrão | serviço |
|---|---|---|
| `USERS_GRPC_PORT` | `50051` | users-service |
| `ORDERS_GRPC_PORT` | `50052` | orders-service |
| `USERS_GRPC_ADDR` | `localhost:50051` | orders-service |
| `ORDERS_GRPC_ADDR` | `localhost:50052` | script de demo |
| `LOG_LEVEL` | `info` | todos (`info`, `error`, `silent`) |

## A lib `@grpc-monorepo/grpc-core`

- **Contratos** em `protos/<domínio>/v1/*.proto`, carregados em runtime com `@grpc/proto-loader` e expostos já tipados (`users`, `orders`).
- **`startServer`**: registra serviços, faz o bind (porta `0` = porta livre, útil em testes) e cuida do shutdown gracioso em `SIGINT`/`SIGTERM`.
- **`unary(handler)`**: escreve handlers como `async (request) => response`. `GrpcError` (`notFound`, `invalidArgument`) vira o status correspondente, erros de chamadas gRPC downstream mantêm o código original e qualquer outro erro vira `INTERNAL` (logado, sem vazar a mensagem).
- **`createClient` + `callUnary`**: client insecure e chamada unária como Promise com deadline padrão de 3s.

### Adicionando um contrato novo

1. Crie `packages/grpc-core/protos/<domínio>/v1/<domínio>.proto`.
2. Inclua o arquivo no script `gen:types` de `packages/grpc-core/package.json` e rode `pnpm gen`.
3. Exponha o pacote em `src/contracts.ts` e exporte os tipos em `src/index.ts`.

As opções do loader em `src/proto.ts` precisam bater com as flags do `gen:types`, senão os tipos gerados não refletem o que chega em runtime.
