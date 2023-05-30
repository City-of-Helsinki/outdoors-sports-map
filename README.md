# Outdoor Exercise Map

The Outdoor Exercise Map is an open communications channel for checking the condition of outdoor sports facilities in Helsinki, Espoo and Vantaa. The Outdoor Exercise Map helps the inhabitants of the municipality find up-to-date information on the City’s outdoor sports services. Currently, the services encompasses the skiing tracks and ice-skating fields maintained by the cities.

## Development

Follow the instructions to set up local development environment. Altertanively, you can use Docker ([see below](#development-with-docker)).

### Prerequisites

-   Preferably use current Node.js LTS
-   Install [NPM](https://www.npmjs.com/) and [Yarn](https://yarnpkg.com)

### Setup

After cloning this repository, create a new `.env` file from the provided `.env.example` file:

```
cp .env.example .env
```

### Running the development environment

To start development server, run:

```
yarn start
```

The application is now available at [http://localhost:5000](http://localhost:5000/).

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

The application is now available at [http://localhost:5000](http://localhost:5000/).

### Starting dockerized production environment

Make sure port `8080` is free.

Pass build-time variables (replace `<VAR_X>` with actual variable name from `.env` file) to docker image and build with:

```
source .env
docker build \
--build-arg <VAR_1>=${<VAR_1>} \
--build-arg <VAR_N>=${<VAR_N>} \
-t outdoors-sports-map .
```

_(you can add `--no-cache` to the command if you don't want to use cache from previous build)_

Start docker container with:

```
docker container run -p 8080:8080 -d outdoors-sports-map
```

_(you can add `--name outdoors-sports-map` to the command for easier referencing)_

The application is now available at [http://localhost](http://localhost/).

## Environments

Test environment: [https://ulkoliikunta.test.kuva.hel.ninja](https://ulkoliikunta.test.kuva.hel.ninja/).
