# Outdoor Exercise Map

The Outdoor Exercise Map is an open communications channel for checking the condition of outdoor sports facilities in Helsinki, Espoo, Vantaa and Kirkkonummi. The Outdoor Exercise Map helps the inhabitants of the municipality find up-to-date information on the City’s outdoor sports services. Currently, the services encompasses the skiing tracks, ice-skating fields, swimming places and other public outdoor services maintained by the cities.

## Development

Follow the instructions to set up local development environment. Alternatively, you can use Docker ([see below](#development-with-docker)).

### Prerequisites

-   Preferably use current Node.js LTS
-   Install [pnpm](https://pnpm.io/installation)

### Setup

After cloning this repository, create a new `.env` file from the provided `.env.example` file:

```
cp .env.example .env
```

### Running the development environment

To start development server, run:

```
pnpm start
```

The application is now available at [http://localhost:3000](http://localhost:3000/).

### Available commands

| Command | Description |
|---------|------------|
| `pnpm start` | Start the development server |
| `pnpm update-runtime-env` | Generate public browser configuration from environment values |
| `pnpm build` | Generate sitemap, type-check, and build for production |
| `pnpm typecheck` | Type-check the project without generating build output |
| `pnpm preview` | Preview the production build locally |
| `pnpm test` | Run tests in watch mode |
| `pnpm test:ui` | Run tests with Vitest UI |
| `pnpm test:coverage` | Run tests with coverage report |
| `pnpm lint` | Lint the source code |

## Development with Docker

Install and configure [Docker](https://www.docker.com/).

Build the project:

```
cp .env.example .env
docker-compose build
```

_(you can add `--no-cache` to the command if you don't want to use cache from previous build)_

Start the application:

```
docker-compose up
```

The application is now available at [http://localhost:3000](http://localhost:3000/).

### Starting dockerized production environment

Make sure port `8080` is free.

Build the production image:

```sh
docker build --target production -t outdoors-sports-map .
```

_(you can add `--no-cache` to the command if you don't want to use cache from previous build)_

Start docker container with:

```sh
docker container run --env-file .env -p 8080:8080 -d outdoors-sports-map
```

_(you can add `--name outdoors-sports-map` to the command for easier referencing)_

The application is now available at [http://localhost:8080](http://localhost:8080/).

Public `REACT_APP_*` settings are loaded from `/env-config.js` before the application
starts. The shared Nginx image generates this file at container startup, using
runtime environment variables over the defaults baked into the image. Supported
settings are listed in `.env.example`; new runtime settings must also be listed
there. The runtime config is served with caching disabled.

Local startup and production builds generate the same browser configuration using
`.env.example` defaults and Vite's mode-specific environment files. Build arguments
remain supported as image defaults. Sitemap generation and Sentry source-map uploads
still run at build time; runtime overrides do not regenerate those artifacts.
Only `REACT_APP_*` values are included in browser configuration. Never use that
prefix for secrets.

## Error tracking (Sentry)

Sentry error tracking, tracing and profiling are disabled by default. To enable, set
`REACT_APP_SENTRY_DSN` (see `.env.example` for the full list of `REACT_APP_SENTRY_*`
variables). Session Replay is wired in but its sample rates default to `0`
(`REACT_APP_SENTRY_REPLAYS_SESSION_SAMPLE_RATE`/`REACT_APP_SENTRY_REPLAYS_ON_ERROR_SAMPLE_RATE`).

Uploading source maps to `city-of-helsinki.sentry.io` during `pnpm build` is optional and
only happens when the build-only `SENTRY_AUTH_TOKEN` variable is set (never commit this
token; it's provided via CI secrets/Docker build args, not `.env`).

## Environments

### Test

Test environment is done from master branch. The pipeline is triggered with a commit to master branch. Normally the commit is pull request merge. 

Test url: [https://ulkoliikunta.test.hel.ninja](https://ulkoliikunta.test.hel.ninja/).

### Review

Review environment is done from pr to main branch. The review environment url is posted to pull request when it is completed.

### Release (staging&production)

Release pipeline is triggered by tag. Tag should be named like 'release-<version>'. The release pipeline builds and deploys the staging environment by default. The production environment requires manual approval in the pipeline [ulkoliikuntakartta-ui-release](https://dev.azure.com/City-of-Helsinki/ulkoliikuntakartta/_build?definitionId=3123&_a=summary)

> Note! Approval requires 2 manual approval, one for build and one for deploy

Staging url: [https://ulkoliikunta.stage.hel.ninja](https://ulkoliikunta.stage.hel.ninja)

Production url: [https://ulkoliikunta.fi](https://ulkoliikunta.fi)
