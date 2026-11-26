# Vehicle Expenses Tracker


<div style="padding: 1cm; font-weight: bold; font-size: large; text-align: center;background-color: darkslateblue;"> Under construction</div>

A simple application to track and manage vehicle-related expenses (fuel, maintenance, insurance etc.) for individual use.

It allows to invite new users to collaborate and share their vehicle expenses - create leaderboards, compare expenses and more.

Also, provides a possibility to create and manage 'project cars' - a car that is being modified or restored by many users, and track all the expenses related to it.


## Stack
Monorepo (in future Turborepo or Nx)

1. Nuxt 3 (Web desktop and mobile - Pinia, TailwindCSS, daisyUI)
2. PostgreSQL (Database)
3. FastAPI (Backend API, Node, better-auth, Kysly)
4. Redis (Caching)
5. Meilisearch (Search engine)
6. Mailpit
7. In future: MINIO (File storage), OpenTelemetry (Monitoring), Grafana (Dashboard), Prometheus (Metrics)

> **For Local development**

 Docker (Containerization) - Ngnix as reverse proxy 
 
 Steps to run locally:
 1. Install mkcert, Docker and docker-compose and pnpm globally
 2. From Project root copy `.env.example` to `.env` and fill in the required values
 3. Run `scripts/dev.install.sh` 
   - generates SSL certificates  
   - adds urls to etc/hosts
   - installs dependencies
 4. run `docker compose -f docker/dev/docker-compose.dev.yaml --env-file .env watch` to start the development environment with enabled hot reload for backend and frontend

