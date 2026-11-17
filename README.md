# grpc-monorepo

Monorepo pnpm com dois serviços Node.js (TypeScript) que se comunicam via gRPC, uma lib com o setup base do gRPC e um pacote de contrato por serviço.

```
packages/grpc-core          # infraestrutura genérica: server, client, erros, logger, loadProto, grpc-gen
packages/contracts-users    # users.proto + tipos gerados + UserService
packages/contracts-orders   # orders.proto + tipos gerados + OrderService
apps/users-service          # implementa UserService (porta 50051)
apps/orders-service         # implementa OrderService (porta 50052) e chama UserService
```

```
grpc-core ◀── contracts-users ◀── users-service
    ▲               ▲
    │               └──────────── orders-service
    └──────── contracts-orders ◀──┘
```

O `grpc-core` não conhece nenhum contrato. Cada serviço é dono do seu pacote `contracts-*`, e quem consome declara só os contratos que usa.

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
| `pnpm gen` | regenera os tipos TS de todos os pacotes de contrato |

## Variáveis de ambiente

| variável | padrão | serviço |
|---|---|---|
| `USERS_GRPC_PORT` | `50051` | users-service |
| `ORDERS_GRPC_PORT` | `50052` | orders-service |
| `USERS_GRPC_ADDR` | `localhost:50051` | orders-service |
| `ORDERS_GRPC_ADDR` | `localhost:50052` | script de demo |
| `LOG_LEVEL` | `info` | todos (`info`, `error`, `silent`) |

## A lib `@grpc-monorepo/grpc-core`

- **`loadProto<T>(url)`**: carrega um `.proto` em runtime com `@grpc/proto-loader` e devolve a árvore de pacotes tipada com o `ProtoGrpcType` gerado.
- **`grpc-gen <arquivo.proto>...`**: gera os tipos TS em `src/generated`. Concentra as flags do gerador para que elas batam com as opções do `loadProto`.
- **`startServer`**: registra serviços, faz o bind (porta `0` = porta livre, útil em testes) e cuida do shutdown gracioso em `SIGINT`/`SIGTERM`.
- **`unary(handler)`**: escreve handlers como `async (request) => response`. `GrpcError` (`notFound`, `invalidArgument`) vira o status correspondente, erros de chamadas gRPC downstream mantêm o código original e qualquer outro erro vira `INTERNAL` (logado, sem vazar a mensagem).
- **`createClient` + `callUnary`**: client insecure e chamada unária como Promise com deadline padrão de 3s.

## Adicionando um contrato novo

Exemplo para um serviço `payments`:

1. Crie `packages/contracts-payments/` copiando o `package.json` e o `tsconfig.json` de `contracts-users`, trocando o nome e o caminho no script `gen`.
2. Escreva `proto/payments/v1/payments.proto` e rode `pnpm gen`.
3. Em `src/index.ts`, exporte o service carregado e os tipos gerados:

   ```ts
   export const { PaymentService } = loadProto<ProtoGrpcType>(
     new URL('../proto/payments/v1/payments.proto', import.meta.url),
   ).payments.v1;
   ```

4. Adicione `"@grpc-monorepo/contracts-payments": "workspace:*"` nos apps que implementam ou consomem o serviço e rode `pnpm install`.

O caminho do `.proto` é montado com `import.meta.url` para resolver a partir do pacote de contrato, independente do diretório onde o processo roda.
