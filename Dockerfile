# Node 24 is the current LTS ("Krypton"), resolved from nodejs.org/dist/index.json
# on 2026-08-11 rather than defaulted to. Deliberately NOT pinned to the Strata
# stack's Node 20: this fixture stands alone and has no compat tie to it.
FROM node:24-alpine

WORKDIR /app

# Zero dependencies on purpose. This fixture's job is to exercise the deploy path,
# not npm — no install step keeps the image build fast and fully deterministic.
COPY package.json server.js ./

ENV NODE_ENV=production
# Cloud Run injects PORT and the container must honour it; 8080 is its default.
ENV PORT=8080
EXPOSE 8080

# node:alpine ships an unprivileged `node` user — don't run as root.
USER node

CMD ["node", "server.js"]
