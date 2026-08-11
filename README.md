# deploy-demo-app

A deliberately tiny, zero-dependency Dockerized web app. It exists to be **deployed**,
not to do anything useful — it is the target fixture for the Strata Deploy track
(`docs/build/projects/Deploy_Design.md`, milestones M2–M8).

## What it does

| Route | Purpose |
|---|---|
| `/` | Renders the running revision, start time and port — visible proof a deploy landed |
| `/healthz` | JSON health probe for the load balancer / uptime check |

## Why it is built this way

- **No dependencies.** The fixture tests the deploy pipeline, not npm. Zero installs
  make the image build fast and fully deterministic.
- **Cloud Run contract honoured.** Reads the injected `PORT`, binds `0.0.0.0`, and
  handles `SIGTERM` so in-flight requests finish when an instance is stopped.
  `K_REVISION` is surfaced on the page so you can see *which* revision answered.
- **Node 24 (current LTS).** Resolved from the Node release feed on 2026-08-11, not
  defaulted to a familiar version.
- **Public repo, free org.** Branch protection and rulesets are available on public
  repos under a GitHub Free org; private repos need Team or above.
- **Non-root.** Runs as the `node` user that `node:alpine` already provides.

## Provenance

Every commit in this repository — including the first — was written by the **Strata
GitHub App** through an installation access token, never by a human's personal
credential. That is the point: it proves Strata can do this in a customer's org
using only the permissions a customer actually grants it.

## Run locally

```bash
docker build -t deploy-demo-app .
docker run --rm -p 8080:8080 deploy-demo-app
curl localhost:8080/healthz
```
