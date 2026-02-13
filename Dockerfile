FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json
RUN pnpm install --frozen-lockfile

COPY tsconfig.json tsconfig.json
COPY packages/backend/tsconfig.json packages/backend/tsconfig.json
COPY packages/backend/src packages/backend/src
COPY packages/frontend/tsconfig.json packages/frontend/tsconfig.json
COPY packages/frontend/tsconfig.node.json packages/frontend/tsconfig.node.json
COPY packages/frontend/vite.config.ts packages/frontend/vite.config.ts
COPY packages/frontend/index.html packages/frontend/index.html
COPY packages/frontend/src packages/frontend/src
RUN pnpm --filter backend build && pnpm --filter frontend build

FROM node:24-alpine AS backend-deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json packages/backend/package.json
RUN pnpm install --filter backend... --prod --frozen-lockfile

FROM nginx:1.29-alpine AS runtime
WORKDIR /app

COPY --from=node:24-alpine /usr/local/bin/node /usr/local/bin/node
COPY --from=node:24-alpine /usr/local/lib /usr/local/lib
COPY --from=backend-deps /app/node_modules /app/node_modules
COPY --from=backend-deps /app/packages/backend/node_modules /app/packages/backend/node_modules
COPY --from=build /app/packages/backend/dist /app/packages/backend/dist
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
COPY start.sh /start.sh

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 80

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s CMD wget --no-verbose --tries=1 --spider http://127.0.0.1/health || exit 1

CMD ["/start.sh"]
