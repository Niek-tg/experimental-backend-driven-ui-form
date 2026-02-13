FROM node:24-alpine AS build
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json packages/backend/package.json
COPY packages/frontend/package.json packages/frontend/package.json
RUN pnpm install --frozen-lockfile

COPY . .
RUN pnpm --filter backend build && pnpm --filter frontend build

FROM node:24-alpine AS backend-deps
WORKDIR /app

RUN corepack enable && corepack prepare pnpm@10.29.3 --activate

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY packages/backend/package.json packages/backend/package.json
RUN pnpm install --filter backend... --prod --frozen-lockfile

FROM nginx:1.29-alpine AS runtime
WORKDIR /app

COPY --from=node:24-alpine /usr/local /usr/local
COPY --from=backend-deps /app/node_modules /app/node_modules
COPY --from=backend-deps /app/packages/backend/node_modules /app/packages/backend/node_modules
COPY --from=build /app/packages/backend/dist /app/packages/backend/dist
COPY --from=build /app/packages/frontend/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

ENV NODE_ENV=production
ENV PORT=3001

EXPOSE 80

CMD ["sh", "-c", "node /app/packages/backend/dist/index.js & exec nginx -g 'daemon off;'"]
