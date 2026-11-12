# syntax=docker/dockerfile:1.7
#
# Platform Admin console (Next.js 16) -- production image, standalone server output.
# Build context: this standalone repository root. Same shape as Dockerfile.web.
#
# NEXT_PUBLIC_API_URL is the PUBLIC origin of the console itself (the API is reached on the same origin
# through the gateway, so the HttpOnly platform session cookie stays host-only). It is inlined at build time.

ARG NODE_IMAGE=node:24-bookworm-slim

FROM ${NODE_IMAGE} AS deps
WORKDIR /repo
ENV NPM_CONFIG_UPDATE_NOTIFIER=false NPM_CONFIG_FUND=false NPM_CONFIG_AUDIT=false
COPY package.json package-lock.json ./
RUN npm install --global npm@11.12.1
RUN --mount=type=cache,target=/root/.npm npm ci

FROM deps AS build
ARG NEXT_PUBLIC_API_URL
ARG NEXT_PUBLIC_API_BASE_PATH=/api/v1
ENV NEXT_PUBLIC_API_URL=$NEXT_PUBLIC_API_URL \
    NEXT_PUBLIC_API_BASE_PATH=$NEXT_PUBLIC_API_BASE_PATH \
    NEXT_OUTPUT=standalone \
    NEXT_TELEMETRY_DISABLED=1
COPY . .
RUN test -n "$NEXT_PUBLIC_API_URL" || (echo "NEXT_PUBLIC_API_URL build argument is required" >&2; exit 1)
RUN npm run build

FROM ${NODE_IMAGE} AS runtime
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3001
WORKDIR /repo
COPY --from=build --chown=node:node /repo/.next/standalone ./
COPY --from=build --chown=node:node /repo/.next/static ./.next/static
COPY --from=build --chown=node:node /repo/public ./public
USER node
EXPOSE 3001
CMD ["node", "server.js"]
